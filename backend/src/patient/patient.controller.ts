import { Controller, Get, Next, Post, Put, Req, Res, UseGuards } from "@nestjs/common";
import { patientService } from "./patient.service";
import { NextFunction, Request, Response } from "express";
import { AuthGuard } from "src/guards/auth.guard";




@Controller("patient")
@UseGuards(AuthGuard)
export class patientController{
    constructor(
        private patientService : patientService
    ){}


    // create patine
    @Post("create")
    async createPatient(@Req() req:Request , @Res() res :Response , @Next() next : NextFunction){
        return await this.patientService.createPatient(req, res, next);
    }

    // update patient profile
    @Put("update/:patientId")
    async updatePatient(@Req() req:Request , @Res() res :Response , @Next() next : NextFunction){
        return await this.patientService.updatePatientProfile(req, res, next);
    }

    // list of the patients
    @Get("list")
    async listPatients(@Req() req:Request , @Res() res :Response , @Next() next : NextFunction){
        return await this.patientService.listOfPatients(req, res, next);
    }

    // find by id
    @Get(":patientId")
    async findPatientById(@Req() req:Request , @Res() res :Response , @Next() next : NextFunction){
        return await this.patientService.findPatientById(req, res, next);
    }

    // delete patient
    @Post("delete/:patientId")
    async deletePatient(@Req() req:Request , @Res() res :Response , @Next() next : NextFunction){
        return await this.patientService.deletePatient(req, res, next);
    }



    
}