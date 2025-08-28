import { Injectable } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { BodyValidator } from 'src/utils/body.validator';
import { ErrorHandler } from 'src/utils/error.handler';
import { createReportDTO } from './dto/repot.dto';
import { prismaService } from 'src/prisma/prisma.service';
import { responseHandler } from 'src/helpers/response.handler';
import { unlinkFile } from 'src/helpers/unlink.file';
import { findByIdHandler } from 'src/helpers/find.id';
import { SendEmail } from 'src/utils/send.mail';
import { join } from 'path';
import { stripeService } from 'src/stripe/stripr.service';
const ejs = require('ejs');


@Injectable()
export class reportService {
  constructor(
    private prisma: prismaService,
    private stripeService: stripeService
  ) {}

  // create report
  async createReport(req: Request, res: Response, next: NextFunction, files) {
    try {
      if (files?.length > 5) {
        // unlink files
        files?.forEach(async (file) => {
          await unlinkFile(file.path);
        });
        return next(new ErrorHandler('You can upload only 3 files', 400));
      }
      // body validation handler
      const bodyValidationResult = BodyValidator.validateBody(
        req,
        createReportDTO,
        next,
      );
      if (bodyValidationResult!) {
        if (files?.length > 0) {
          files?.forEach(async (file) => {
            await unlinkFile(file.path);
          });
        }
        return next(new ErrorHandler(bodyValidationResult, 400));
      }
      const { reportName, description, doctorId, reportEmail } = req.body;

      // find patient by id
      const isDoctorExist =
        await findByIdHandler.findById(
          doctorId,
          this.prisma,
        );
      if (!isDoctorExist) {
        if (files?.length > 0) {
          files?.forEach(async (file) => {
            await unlinkFile(file.path);
          });
        }
        return next(new ErrorHandler('Doctor not found', 404));
      }

      // check user upload one file al least
      if (!files || files.length === 0) {
        if (files?.length > 0) {
          files?.forEach(async (file) => {
            await unlinkFile(file.path);
          });
        }
        return next(new ErrorHandler('Please upload at least one file', 400));
      }

     

      // create report
      const report = await this.prisma.report.create({
        data: {
          description: description,
          fullName: reportName,
          reportEmail: reportEmail,
          doctorId: doctorId,
          reportAssets: {
            create: files.map((file) => ({
              fileName: file?.originalname,
              fileURL: `https://${req.headers.host}/${file?.path}`,
              mimeType: file?.mimetype,
            })),
          },
        },
        select: {
          id: true,
          description: true,
          fullName: true,
          reportEmail: true,
          reportAssets: {
            select: {
              id: true,
              fileName: true,
              fileURL: true,
              mimeType : true,
            },
          },
        },
      });

       // create checkout session
       const session = await this.stripeService.createCheckOutSession(report.id , process.env.STRIPE_PRODUCT_PRICE_ID_REPORT!,"report", doctorId);
       if (!session.success) {
         if (files?.length > 0) {
           files?.forEach(async (file) => {
             await unlinkFile(file.path);
           });
         }
         return next(new ErrorHandler(session.message, 400));
       }

      responseHandler.sendResponse({
        res,
        statusCode: 201,
        message: 'Report created successfully',
        data: { report , sessionUrl: session.url },
      });
    } catch (error: any) {
      if (files?.length > 0) {
        files?.forEach(async (file) => {
          await unlinkFile(file.path);
        });
      }
      return next(new ErrorHandler(error.message, 500));
    }
  }

  // all reports
  async allReports(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return next(new ErrorHandler('User not found', 404));
      }

      // fetch all reports
      const reports = await this.prisma.report.findMany({
        where: {
          doctorId: userId
        },
        select: {
          id: true,
          description: true,
          fullName: true,
          reportEmail: true,
          createdAt : true,
          status : true,
          paymentStatus : true,
          reportAssets: {
            select: {
              id: true,
              fileName: true,
              fileURL: true,
            },
          },
        },
      });

      responseHandler.sendResponse({
        res,
        statusCode: 200,
        message: 'All reports',
        data: { reports },
      })

    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }

  // update status of report in list
  async updateReportStatus(req: Request, res: Response, next: NextFunction) {
    try {
      if(!req.body){
        return next(new ErrorHandler('Please provide report ids', 400));
      }
      if(!req.body.reportIds) {
        return next(new ErrorHandler('Please select at least one report', 400));
      }
     
      const reportIds = [...req.body.reportIds];
      const status = "COMPLETED";
      const userId = req.user?.id;
      if (!userId) {
        return next(new ErrorHandler('User not found', 404));
      }
      // check if reportIds is empty
      if (reportIds.length === 0) {
        return next(new ErrorHandler('Please select at least one report', 400));
      }
      // update each report status
      const reports = await Promise.all(
        reportIds.map(async (reportId) => {
          // check if report exists
          const isReportExist = await this.prisma.report.findUnique({
            where: {
              id: reportId,
              doctorId: userId,
            },
          });
          if (!isReportExist) {
            return next(new ErrorHandler('One or many reports not found', 404));
          }
          // update report status
          const report = await this.prisma.report.update({
            where: {
              id: reportId,
              doctorId: userId,
            },
            data: {
              status: status,
            },
            select: {
              id: true,
              description: true,
              fullName: true,
              reportEmail: true,
              createdAt: true,
              status: true,
              reportAssets: {
                select: {
                  id: true,
                  fileName: true,
                  fileURL: true,
                },
              },
            },
          });
          return report;
        }),
      );
      responseHandler.sendResponse({
        res,
        statusCode: 200,
        message: 'Report status updated successfully',
        data: { reports },
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }


  // send report email link
  async sendReportEmailLink(req:Request,res:Response,next:NextFunction){
    try {
      // body validation handler
      const bodyValidationResult = BodyValidator.validateBody(req, ["email", "subject", "message", "link"],next);
      if(bodyValidationResult){
        return next(new ErrorHandler(bodyValidationResult,400))
      }
      const {email, subject, message, link} = req.body;

      const templatePath = join(__dirname, '../',"../","../", 'templates', 'booking.ejs');
      const html = await ejs.renderFile(templatePath, {
        name: "Name",
        bookingLink: link,
        companyName: "MediConnect"
      });
      // send email 
      const sendEmail = await SendEmail({
        email:email,
        subject:subject,
        html: true,
        template : html
      })
      if(!sendEmail.success){
        return next(new ErrorHandler(sendEmail.message,500))
      }
      responseHandler.sendResponse({
        res,
        statusCode: 200,
        message: 'Email sent successfully',
      });
      
    } catch (error:any) {
      return next(new ErrorHandler(error.message,400))
      
    }
  }
}
