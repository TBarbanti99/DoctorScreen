import { Injectable } from "@nestjs/common";
import { prismaService } from "src/prisma/prisma.service";
import * as bcrypt from 'bcrypt';
import { NextFunction, Request, Response } from "express";
import { ErrorHandler } from "src/utils/error.handler";
import { BodyValidator } from "src/utils/body.validator";
import { createUserDTO , userLoginSchema } from "./dtos/createUser.dot";
import { findEmailHandler } from "src/helpers/find.email";
import { responseHandler } from "src/helpers/response.handler";
import { JwtService } from "@nestjs/jwt";
import { createTokenHandler } from "src/helpers/token.create";
import { findByIdHandler } from "src/helpers/find.id";
import { unlinkFile } from "src/helpers/unlink.file";
import { stripeService } from "src/stripe/stripr.service";



@Injectable()
export class userService{
    constructor(
        private Prisma : prismaService,
        private JwtService : JwtService,
        private stripeService : stripeService
    ){}

    async create(req : Request , res : Response , next : NextFunction , file: Express.Multer.File){
        try {
            // body validation handler
            const bodyValidationResult = BodyValidator.validateBody(req, createUserDTO , next);
            if(bodyValidationResult!){
                // unlink the file
                if(file){
                   await unlinkFile(file.path);
                }
               return next(new ErrorHandler(bodyValidationResult , 400))
            }

            // data
            const {email , password , userName} = req.body;

            // find User by email
            const isEmail = await findEmailHandler.findEmail(email, this.Prisma)
            if(isEmail){
                 // unlink the file
                 if(file){
                    await unlinkFile(file.path);
                }
                return next(new ErrorHandler("Email already exists", 400))
            }
            // hash password
            const hashedPassword = await bcrypt.hash(password, 10);

           

            // create User
            const user = await this.Prisma.user.create({
                data: {
                    email,
                    password: hashedPassword,
                    userName,
                    profilePicture : file ? `https://${req.headers.host}/${file.path}` : null,
                },
            });
            // create tokens
            const tokens =  createTokenHandler.createToken(user.id , this.JwtService)

            // create stripe session
            const session_url = await this.stripeService.createCheckOutSession(user.id , process.env.STRIPE_PRODUCT_ID!, "user" , user.id);
            if(!session_url.success){
                return next(new ErrorHandler(session_url.message , 500));
             }

            responseHandler.sendResponse({
                message: "User created successfully",
                statusCode: 201,
                res,
                data: {
                    sessionUrl  : session_url.url
                },
            })
        } catch (error:any) {
             // unlink the file
             if(file){
                await unlinkFile(file.path);
            }
           return next(new ErrorHandler(error.message, 400))
        }
    }

    // login 
    async login(req:Request, res:Response , next : NextFunction){
        try {
            // body validator 
            const bodyValidationResult = BodyValidator.validateBody(req , userLoginSchema , next);
            if(bodyValidationResult){
                return next(new ErrorHandler(bodyValidationResult, 400))
            }

            // data 
            const {email , password} = req.body;

            // find email
            const isEmail = await findEmailHandler.findEmail(email, this.Prisma);
            if(!isEmail){
                return next(new ErrorHandler("Invalid email or password", 401))
            }

            // match password
            const isMatch = await bcrypt.compare(password , isEmail.password);
            if(!isMatch){
                return next(new ErrorHandler("Invalid email or password", 401))
            }

            if(isEmail.status == "UNPAID"){
                return next(new ErrorHandler("Your subscription is unpaid. Please retry. Your account will be deleted after 5 minutes.", 400))
            }

            const tokens = createTokenHandler.createToken(isEmail.id , this.JwtService);

            responseHandler.sendResponse({
                message : "Login Successful",
                statusCode : 200,
                res : res,
                data : {
                    user : isEmail,
                    tokens
                }
            })
            
        } catch (error:any) {
           return next(new ErrorHandler(error.message, 400))
        }
    }

    // refresh access_token
    async refreshToken(req:Request, res:Response, next : NextFunction){
        try {

            // body validator
            const bodyValidationResult = BodyValidator.validateBody(req , ["refresh_token"], next);
            if(bodyValidationResult){
                return next(new ErrorHandler(bodyValidationResult, 404))
            }

            const refresh_token = req.body.refresh_token;

            // now verify is the refresh token expired
            const payload = await this.JwtService.verifyAsync(refresh_token,{
                secret : process.env.JWT_SECRET
            });

            // find user by id
            const isUser = findByIdHandler.findById(payload.id , this.Prisma);
            if(!isUser){
                return next(new ErrorHandler("User not found", 401))
            }

            // create new tokens
            const tokens = createTokenHandler.createToken(payload.id , this.JwtService)

            responseHandler.sendResponse({
                message : "Token refresh successful",
                statusCode : 200,
                res,
                data : {
                    tokens
                }
            })
            
        } catch (error:any) {
           return next(new ErrorHandler(error.message, 400))
        }
    }


    // update user profile
    async updateProfile(req:Request, res:Response, next : NextFunction , file: Express.Multer.File){
        try {
            const userId = req.user?.id;
            if(!userId){
                if(file){
                    await unlinkFile(file.path);
                }
                return next(new ErrorHandler("User id not found", 404))
            }

            const user = await findByIdHandler.findById(userId , this.Prisma);
            if(!user){
                if(file){
                    await unlinkFile(file.path);
                }
                return next(new ErrorHandler("User not found", 404))
            }
            
            if(!req.body){
                if(file){
                    await unlinkFile(file.path);
                }
                return next(new ErrorHandler("Missing request body", 404))

            }

            // first find email
            if(req.body.email){
                const isEmail = await findEmailHandler.findEmail(req.body.email, this.Prisma);
                if(isEmail && isEmail.id!== userId){
                    return next(new ErrorHandler("Email already exists", 400))
                }
            }

            // update user
            const updatedUser = await this.Prisma.user.update({
                where :{
                    id : userId
                },
                data :{
                    email : req.body.email || user.email,
                    userName : req.body.userName || user.userName,
                    phone : req.body.phone || user.phone,
                    profilePicture : file ? `https://${req.headers.host}/${file.path}` : user.profilePicture,

                }
            });

            responseHandler.sendResponse({
                message : "Profile updated successfully",
                statusCode : 200,
                res,
                data : {
                    updatedUser
                }
            })
            
            
        } catch (error:any) {
            if(file){
                await unlinkFile(file.path);
            }
            return next(new ErrorHandler(error.message , 400))
            
        }
    }

    // update password
    async updatePassword(req:Request, res:Response, next : NextFunction){
        try {

            const bodyValidationResult = BodyValidator.validateBody(req , ["oldPassword", "newPassword"], next);
            if(bodyValidationResult){
                return next(new ErrorHandler(bodyValidationResult , 400));
            }

            const userId = req.user?.id;
            if(!userId){
                return next(new ErrorHandler("User id not found", 404))
            }

            const user = await findByIdHandler.findById(userId , this.Prisma);
            if(!user){
                return next(new ErrorHandler("User not found", 404))
            }

            const {oldPassword ,newPassword} = req.body;

            if(oldPassword === newPassword){
                return next(new ErrorHandler("oldPassword and newPassword are same", 404))
            }

            // verify oldPassword
            const isMatch = await bcrypt.compare(oldPassword , user.password);
            if(!isMatch){
                return next(new ErrorHandler("Invalid old password", 401))
            }

            // hash password
            const hashedPassword = await bcrypt.hash(newPassword, 10);

            // update user
            await this.Prisma.user.update({
                where :{
                    id : userId
                },
                data :{
                    password : hashedPassword
                }
            });
            

            responseHandler.sendResponse({
                message : "Password changed successfully",
                statusCode : 200,
                res,
            })

                        
        } catch (error:any) {
            return next(new ErrorHandler(error.message , 400));
        }
    }

    
    

}