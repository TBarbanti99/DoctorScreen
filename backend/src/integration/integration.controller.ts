import { Controller, Get, Next, Post, Req, Res, UseGuards } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { integrationService } from "./integration.service";
import { AuthGuard } from "src/guards/auth.guard";






@Controller("integration")
export class IntegrationController{
    constructor(
        private integrationService: integrationService
    ){}


    // connect
    @Post("connect")
    @UseGuards(AuthGuard)
    async connect(@Req() req:Request , @Res() res:Response , @Next() next:NextFunction){
       return await this.integrationService.createIntegration(req, res, next);
    }

    // get user integrations
    @Get("list")
    @UseGuards(AuthGuard)
    async getIntegration(@Req() req:Request , @Res() res:Response , @Next() next:NextFunction){
        return await this.integrationService.getIntegration(req, res, next);
    }

    // disconnect
    @Post("disconnect")
    @UseGuards(AuthGuard)
    async disconnect(@Req() req:Request , @Res() res:Response , @Next() next:NextFunction){
        return await this.integrationService.disconnectIntegration(req, res, next);
    }

    // add meta_data
    @Post("meta/data")
    @UseGuards(AuthGuard)
    async addMetaData(@Req() req:Request , @Res() res:Response , @Next() next:NextFunction){
        return await this.integrationService.addMetaData(req, res, next);
    }

    // send booking link
    @Post("send/booking/link")
    async sendBookingLink(@Req() req:Request , @Res() res:Response , @Next() next:NextFunction){
        return await this.integrationService.sendBookingLink(req, res, next);
    }
}