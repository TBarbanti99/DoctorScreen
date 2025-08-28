import { Injectable } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { prismaService } from "src/prisma/prisma.service";
import { BodyValidator } from "src/utils/body.validator";
import { ErrorHandler } from "src/utils/error.handler";
import { createIntegrationDTO, sendBookingLinkDTO } from "./integration.dto";
import { responseHandler } from "src/helpers/response.handler";
import axios from "axios";
import { stripeService } from "src/stripe/stripr.service";
@Injectable()
export class integrationService {
  constructor(
    private Prisma : prismaService,
    private stripeService : stripeService
  ) {}


  // create integration
  async createIntegration(req: Request, res: Response, next: NextFunction) {
    try {

        // body validation handler
        const bodyValidationResult = BodyValidator.validateBody(req, createIntegrationDTO , next);
        if(bodyValidationResult!){
            return next(new ErrorHandler(bodyValidationResult , 400))
        }
        const userId = req.user?.id;
        if(!userId){
            return next(new ErrorHandler("User not found", 404))
        }
        const {platform, access_token , platformURL} = req.body;
        // create integration
        const integration = await this.Prisma.integration.create({
            data:{
                access_token : access_token,
                platform : platform,
                platformURL : platformURL,
                userId : userId,
            },
            select:{
                id : true,
                platform : true,
                platformURL : true,
                userId : true,
            }
        });
        const allintegration = await this.Prisma.integration.findMany({
            where : {
                userId : req.user?.id
            },
            select:{
                id : true,
                platform : true,
                platformURL : true,
                userId : true,
                meta_data : true,
            }

        })
        // response handler
        return responseHandler.sendResponse({
            message : "Integration created successfully",
            statusCode : 201,
            data : allintegration,
            res : res,
        });

    } catch (error:any) {
        return next(new ErrorHandler(error.message , 500));
    }
  }

  // get integration against user
  async getIntegration(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = req.user?.id;
        if(!userId){
            return next(new ErrorHandler("User not found", 404))
        }
        // find integration
        const integration = await this.Prisma.integration.findMany({
            where:{
                userId : userId,
            },
            select:{
                id : true,
                platform : true,
                platformURL : true,
                userId : true,
                meta_data : true,
            }
        });
        // response handler
        return responseHandler.sendResponse({
            message : "Integration fetched successfully",
            statusCode : 200,
            data : integration,
            res : res,
        });

    } catch (error:any) {
        return next(new ErrorHandler(error.message , 500));
    }
  }


  // disconnect
  async disconnectIntegration(req: Request, res: Response, next: NextFunction) {
    try {
        if(!req.body){
            return next(new ErrorHandler("Body is required", 400))
        }
        const userId = req.user?.id;
        if(!userId){
            return next(new ErrorHandler("User not found", 404))
        }
        const {integrationId} = req.body;
        if(!integrationId){
            return next(new ErrorHandler("Integration id is required", 400))
        }
        // delete integration
        const integration = await this.Prisma.integration.delete({
            where:{
                id : integrationId,
            },
        });
        // response handler
        return responseHandler.sendResponse({
            message : "Disconnect successfully",
            statusCode : 200,
            data : {
                id : integration.id,
            },
            res : res,
        });

    } catch (error:any) {
        return next(new ErrorHandler(error.message , 500));
    }
  } 


  // add meta data in integration
  async addMetaData(req: Request, res: Response, next: NextFunction) {
    try {
        if(!req.body){
            return next(new ErrorHandler("Body is required", 400))
        }
        const userId = req.user?.id;
        if(!userId){
            return next(new ErrorHandler("User not found", 404))
        }
        const {integrationId, meta_data} = req.body;
        if(!integrationId || !meta_data){
            return next(new ErrorHandler("Integration id and meta data is required", 400))
        }
        // find integration
        const integrationExist = await this.Prisma.integration.findUnique({
            where:{
                id : integrationId,
            },
        });
        if(!integrationExist){
            return next(new ErrorHandler("Integration not found", 404))
        }
        // update integration
        const integration = await this.Prisma.integration.update({
            where:{
                id : integrationId,
            },
            data:{
                meta_data : meta_data,
            },
            select:{
                id : true,
                platform : true,
                platformURL : true,
                userId : true,
                meta_data : true,
            }
        });

        const allintegration = await this.Prisma.integration.findMany({
            where : {
                userId : req.user?.id
            },
            select:{
                id : true,
                platform : true,
                platformURL : true,
                userId : true,
                meta_data : true,
            }

        })
        // response handler
        return responseHandler.sendResponse({
            message : "Meta data added successfully",
            statusCode : 200,
            data : allintegration,
            res : res,
        });

        
    } catch (error:any) {
        return next(new ErrorHandler(error.message , 500));
    }
  }


  // async send booking link to user
  async sendBookingLink(req: Request, res: Response, next: NextFunction) {
    try {

        // body handler
        const bodyValidationResult = BodyValidator.validateBody(req, sendBookingLinkDTO , next);
        if(bodyValidationResult!){
            return next(new ErrorHandler(bodyValidationResult , 400))
        }
        const {email, name, phone, note , userId} = req.body;

        // integration
        const integration = await this.Prisma.integration.findFirst({
            where :{
                userId : userId,
                platform : "calendly"
            },
            select:{
                access_token : true,
                meta_data : true,
            }
        });


        if (!integration) {
            return next(new ErrorHandler("Integration not found", 404));
        }

        // @ts-ignore
        if (!integration.meta_data?.uri) {
            return next(new ErrorHandler("Event type URI not found in integration metadata", 400));
        }

        // Create Calendly scheduling link
        const calendlyResponse = await axios.post(
            'https://api.calendly.com/scheduling_links',
            {
                max_event_count: 1,
                //@ts-ignore
                owner: integration.meta_data.uri,
                owner_type: 'EventType'
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${integration.access_token}`
                }
            }
        );

        const bookingUrl = calendlyResponse.data.resource.booking_url;

   



     const newConsultation = await this.Prisma.consultation.create({
        data : {
            bookingUrl : bookingUrl,
            name: name,
            email: email,
            phone: phone,
            note: note,
            status: "pending",  
            doctorId : userId   
        }
     });


     const session_url = await this.stripeService.createCheckOutSession(newConsultation.id , process.env.STRIPE_PRODUCT_PRICE_ID_CONSULTATION!,"consultation" ,userId);
     if(!session_url.success){
        return next(new ErrorHandler(session_url.message , 500));
     }

        // response handler
        responseHandler.sendResponse({
            message : "Payment link generate successfully",
            statusCode : 200,
            res : res,
            data : {
                sessionUrl  : session_url.url
            }
        })        
    } catch (error:any) {
        return next(new ErrorHandler(error.message , 500));
    }
  }



}