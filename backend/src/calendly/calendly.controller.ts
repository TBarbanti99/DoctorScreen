import { Controller, Get, Next, Req, Res, UseGuards } from "@nestjs/common";
import { CalendlyService } from "./calendly.service";
import { AuthGuard } from "src/guards/auth.guard";
import { NextFunction, Request, Response } from "express";




@Controller("calendly")
export class CalendlyController {
    constructor(
        private calendlyService: CalendlyService
    ) {}
    

    // calendly event list
    @Get("events")
    @UseGuards(AuthGuard)
    async getCalendlyEvents(@Req() req: Request ,@Res() res: Response, @Next() next: NextFunction) {
        return await this.calendlyService.getCalendlyEvents(req,res,next);
    }

    // get consultation
    @Get("consultation")
    @UseGuards(AuthGuard)
    async getCalendlyConsultation(@Req() req: Request ,@Res() res: Response, @Next() next: NextFunction) {
        return await this.calendlyService.getCalendlyConsultations(req,res,next);
    }
}