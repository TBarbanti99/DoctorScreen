import { Controller, Get, Next, Post, Req, Res, UseGuards } from "@nestjs/common";
import { stripeService } from "./stripr.service";
import { NextFunction, Request, Response } from "express";
import { AuthGuard } from "src/guards/auth.guard";



@Controller("stripe")
export class stripeController {
    constructor(private stripeService: stripeService) {}


    // verify stripe payment
    @Post("verify/payment")
    async verifyPayment(@Req() req:Request,@Res() res:Response,@Next() next:NextFunction) {
        return await this.stripeService.verifyPayment(req, res, next);
    }

    @Get("payment/list")
    @UseGuards(AuthGuard)
    async PaymentList(@Req() req:Request,@Res() res:Response,@Next() next:NextFunction) {
        return await this.stripeService.allPayments(req, res, next);
    }

    // save stripe credentials
    @Post("/create/credentials")
    @UseGuards(AuthGuard)
    async addStripeCredentials(@Req() req:Request ,@Res() res:Response ,@Next() next:NextFunction ){
        return await this.stripeService.addStripeCredentials(req,res,next)
    }
}

