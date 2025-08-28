import { Injectable } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { BodyValidator } from "src/utils/body.validator";
import { ErrorHandler } from "src/utils/error.handler";
import { createPatientDTO } from "./dtos/patient.dto";
import { prismaService } from "src/prisma/prisma.service";
import { responseHandler } from "src/helpers/response.handler";
import { patientHandlerInstance } from "src/helpers/patient.handler";



@Injectable()
export class patientService{
    constructor(
        private Prisma : prismaService,
    ){}


    // create patient
    async createPatient(req:Request, res : Response,next : NextFunction){
        try {
            // body validation handler
            const bodyValidationResult = BodyValidator.validateBody(req, createPatientDTO , next);
            if(bodyValidationResult!){
                return next(new ErrorHandler(bodyValidationResult , 400))
            }
            const {firstName,lastName,email,age,gender,phoneNumber} = req.body;

            // check is email already exists
            const isEmail = await patientHandlerInstance.findEmailHandler(email, this.Prisma);
            if(isEmail){
                return next(new ErrorHandler("Email already exists", 400))
            }

            const userId = req.user?.id;
            if(!userId){
                return next(new ErrorHandler("User not found", 404))
            }

            // create patient
            const patient = await this.Prisma.patient.create({
                data:{
                    firstName,
                    lastName,
                    email,
                    age,
                    gender,
                    phoneNumber,
                    userId,
                },
            });

            responseHandler.sendResponse({
                res,
                statusCode: 201,
                message: "Patient created successfully",
                data: {patient},
            })
        } catch (error:any) {
            return next(new ErrorHandler(error.message, 500));
            
        }
    }

    // update patient profile
    async updatePatientProfile(req:Request, res : Response,next : NextFunction){
        try {
        
            const {patientId} = req.params;
            if(!patientId){
                return next(new ErrorHandler("Patient id is required", 400))
            }

            // if req.body is undefined
            if(!req.body){
                return next(new ErrorHandler("Body is required", 400))
            }

            // find patient by id
            const isPatient = await patientHandlerInstance.findPatientByIdHandler(patientId, this.Prisma);
            if(!isPatient){
                return next(new ErrorHandler("Patient not found", 404))
            }

            // check is the patient userId is same as the logged in user
            if(isPatient.userId !== req.user?.id){
                return next(new ErrorHandler("You are not authorized to update this patient", 403))
            }

            // check if patient email is already exists
            const isPatientEmail = await patientHandlerInstance.findEmailHandler(isPatient.email, this.Prisma);
            if(isPatientEmail && isPatientEmail.id !== patientId){
                return next(new ErrorHandler("Email already exists", 400))
            }

            // update patient
            const updatedPatient = await this.Prisma.patient.update({
                where :{
                    id : patientId
                },
                data : {
                    firstName : req.body.firstName || isPatient.firstName,
                    lastName : req.body.lastName || isPatient.lastName,
                    email : req.body.email || isPatient.email,
                    age : req.body.age || isPatient.age,
                    gender : req.body.gender || isPatient.gender,
                    phoneNumber : req.body.phoneNumber || isPatient.phoneNumber,
                    status : req.body.status === false ? false : true || isPatient.status,
                }
            })

            responseHandler.sendResponse({
                res,
                statusCode: 200,
                message: "Patient updated successfully",
                data: {updatedPatient},
            })
            
        } catch (error:any) {
            return next(new ErrorHandler(error.message, 500));
        }
    }

    // list of patients associated with the user
    async listOfPatients(req:Request, res : Response,next : NextFunction){
        try {
            const userId = req.user?.id;
            if(!userId){
                return next(new ErrorHandler("User not found", 404))
            }

            // find patients associated with the user
            const patients = await this.Prisma.patient.findMany({
                where :{
                    userId,
                },
                orderBy :{
                    createdAt : "desc"
                }
            })

            responseHandler.sendResponse({
                res,
                statusCode: 200,
                message: "Patients fetched successfully",
                data: {patients},
            })
            
        } catch (error:any) {
            return next(new ErrorHandler(error.message, 500));    
        }
    }

    // find patient by id
    async findPatientById(req:Request, res : Response,next : NextFunction){
        try {
            const {patientId} = req.params;
            if(!patientId){
                return next(new ErrorHandler("Patient id is required", 400))
            }

            // find patient by id
            const patient = await patientHandlerInstance.findPatientByIdHandler(patientId, this.Prisma);
            if(!patient){
                return next(new ErrorHandler("Patient not found", 404))
            }

            responseHandler.sendResponse({
                res,
                statusCode: 200,
                message: "Patient fetched successfully",
                data: {patient},
            })
            
        } catch (error:any) {
            return next(new ErrorHandler(error.message, 500));
        }
    }

    // delete patient
    async deletePatient(req:Request, res : Response,next : NextFunction){
        try {
            const {patientId} = req.params;
            if(!patientId){
                return next(new ErrorHandler("Patient id is required", 400))
            }

            // find patient by id
            const patient = await patientHandlerInstance.findPatientByIdHandler(patientId, this.Prisma);
            if(!patient){
                return next(new ErrorHandler("Patient not found", 404))
            }

            // check if the patient is associated with the user
            if(patient.userId !== req.user?.id){
                return next(new ErrorHandler("You are not authorized to delete this patient", 403))
            }

            // delete patient
            await this.Prisma.patient.delete({
                where :{
                    id : patientId,
                }
            })

            responseHandler.sendResponse({
                res,
                statusCode: 200,
                message: "Patient deleted successfully",
                data: {patientId},
            })
            
        } catch (error:any) {
            return next(new ErrorHandler(error.message, 500));
        }
    }
}