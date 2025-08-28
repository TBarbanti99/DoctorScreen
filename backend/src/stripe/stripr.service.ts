import { Injectable } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { join } from 'path';
import { responseHandler } from 'src/helpers/response.handler';
import { prismaService } from 'src/prisma/prisma.service';
import { BodyValidator } from 'src/utils/body.validator';
import { ErrorHandler } from 'src/utils/error.handler';
import { SendEmail } from 'src/utils/send.mail';
import Stripe from 'stripe';
const ejs = require('ejs');




@Injectable()
export class stripeService {
  constructor(private prisma: prismaService) {}


  createCheckOutSession = async (
    id: string,
    priceId: string,
    type = 'report',
    userId : string
  ) => {
    try {

      var isStripeCredentials:any;
      if(type !== "user"){
        isStripeCredentials = await this.prisma.integration.findFirst({
         where:{
           userId : userId,
           platform : "stripe"
         }
       });
       if(!isStripeCredentials || !isStripeCredentials.secretKey || !isStripeCredentials.publicKey){
         return {
           success : false,
           message : "Stripe credentials not found"
         }
       }
      }

      const stripe = new Stripe(type === "user" ? process.env.STRIPE_SECRET_KEY! : isStripeCredentials.secretKey!);
      const session = await stripe.checkout.sessions.create({
        success_url: `${process.env.SUCCESS_URL}&state=${id}&doctorId=${userId}&type=${type}`,
        cancel_url: process.env.CANCEL_URL,
        mode: 'payment',
        line_items: [
         {
            ...(type === "user" ? {
              price : process.env.STRIPE_PRODUCT_ID!,
            }:{
              price_data :{
                currency : "usd",
              product_data:{
                name:  type == 'report' ? 'Report Payment' : 'Consultation Payment',
              },
              unit_amount: type ===  "report" ? isStripeCredentials.stripeAmountReport! * 100 : isStripeCredentials.stripeAmount! * 100, // Stripe expects amount in cents
            }
         }),
          quantity: 1,
         }
        ],
      });
      if (!session.url) {
        return {
          success: false,
          message: 'Something went wrong in creating session',
        };
      }
      return {
        success: true,
        url: session.url,
      };
    } catch (error: any) {
      console.log(error)
      return {
        success: false,
        message: error.message,
      };
    }
  };

  // verify the stripe payment

  verifyPayment = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { state, session_id ,doctorId } = req.body;
      console.log(doctorId ,state);
      if (!state || !session_id || !doctorId) {
        return next(
          new ErrorHandler('Please provide state and session id', 400),
        );
      }
      const isUserPay = state == doctorId;
      var isStripeCredentials:any;
      if(!isUserPay){
        isStripeCredentials = await this.prisma.integration.findFirst({
         where:{
           userId : doctorId,
           platform : "stripe"
         }
       });
       if(!isStripeCredentials || !isStripeCredentials.secretKey || !isStripeCredentials.publicKey){
         return {
           success : false,
           message : "Stripe credentials not found"
         }
       }
      }


      const stripe = new Stripe(isUserPay ? process.env.STRIPE_SECRET_KEY! :  isStripeCredentials.secretKey!);
      const session = await stripe.checkout.sessions.retrieve(session_id);
      if (!session) {
        return next(new ErrorHandler('Session not found', 400));
      }
      if (session.payment_status !== 'paid') {
        return next(new ErrorHandler('Payment not completed', 400));
      }
    //   if (session.amount_total !== 5000 || session.amount_total !== 50000) {
    //     return next(new ErrorHandler('Payment amount not matched', 400));
    //   }

      const type = session.success_url?.split('type=')[1];
      if (!type) {
        return next(new ErrorHandler('Type not found', 400));
      }

      var report:any;
      var consultation:any;
      var user:any;
      // if type report
      if (type == 'report') {
        // find report by state
        report = await this.prisma.report.findUnique({
          where: {
            id: state,
          },
        });
        if (!report) {
          return next(new ErrorHandler('Report not found', 400));
        }
      }

    //    if type is consultation
      if (type == 'consultation') {
         consultation = await this.prisma.consultation.findUnique({
            where: {
                id : state,
            }
        });
        if(!consultation){
            return next(new ErrorHandler('Consultation not found', 400));
        }
      }

      // if type is user
      if(type == 'user'){
        // find user by state
         user = await this.prisma.user.findUnique({
          where:{
            id : state,
          }
        });
        if(!user){
          return next(new ErrorHandler('User not found', 400));
        }
        // update user PAID status
        await this.prisma.user.update({
          where:{
            id : state,
          },
          data:{
            status : "PAID"
          }
        });

      }

      // now create payment in db
      const newPayment = await this.prisma.payment.create({
        data: {
          amount: session.amount_total!,
          currency: session.currency ?? 'unknown',
          email: session.customer_details?.email ?? 'unknown',
          name: session.customer_details?.name ?? 'unknown',
          paymentStatus: session.status ?? 'unknown',
          reportId: state,
          sessionId: session.id,
          doctorId: type == 'user' ? user.id : type == "report" ? report.doctorId : consultation.doctorId,
        },
      });


      if(type == "report"){
          // update the report paymentStatus
          await this.prisma.report.update({
            where: {
              id: state,
            },
            data: {
              paymentStatus: 'COMPLETED',
            },
          });
      }else if(type == "consultation"){
        const templatePath = join(__dirname, '../',"../","../", 'templates', 'booking.ejs');
        const html = await ejs.renderFile(templatePath, {
            name: consultation.name,
            bookingLink: consultation.bookingUrl,
            companyName: "MediConnect"
          });

        // send email to user 
       const result:any= await SendEmail({
            email : consultation.email,
            subject : "Booking Link",
            html: true,
            template : html
        });
        if(!result?.success){
            return next(new ErrorHandler("Email not sent", 500))
        }
      }

      return res.status(200).json({
        success: true,
        message: 'Payment verified successfully',
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  };

  // fetch all payments
  allPayments = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const payments = await this.prisma.payment.findMany({
        where: {
          doctorId: req.user?.id,
        },
      });
      return res.status(200).json({
        success: true,
        data: {
          payments,
        },
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  };

  // add stripe credentials
  addStripeCredentials = async(req:Request , res : Response , next:NextFunction)=>{
    try {

      const schema = ["publicKey", "privateKey","amount","amountReport"];
      const bodyValidationError = BodyValidator.validateBody(req,schema,next)
      if(bodyValidationError){
        return next(new ErrorHandler(bodyValidationError , 400))
      }
      const {publicKey , privateKey ,amount,amountReport} = req.body;

      // find publicKey and privateKey

      const isExistCredential = await this.prisma.integration.findFirst({
        where:{
          publicKey : publicKey,
          secretKey : privateKey,
          platform : "Stripe"
        }
      });
      if(isExistCredential){
        return next(new ErrorHandler("Stripe publicKey or secretKey already exist",400))
      }

      await this.prisma.integration.create({
        data :{
          // @ts-ignore
          userId : req.user.id,
          publicKey : publicKey,
          secretKey : privateKey,
          stripeAmount : parseInt(amount),
          stripeAmountReport : parseInt(amountReport),
          platform : "stripe",
        }
      });

      const allintegration = await this.prisma.integration.findMany({
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

      responseHandler.sendResponse({
        message : "Stripe credentials added successfully",
        res : res,
        statusCode : 200,
        data : allintegration
      })

      
    } catch (error:any) {
      return next(new ErrorHandler(error.message || "Internal Server Error" , 500))
    }
  }
}
