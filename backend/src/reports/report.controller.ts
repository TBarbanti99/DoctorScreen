import {
  Controller,
  Get,
  Next,
  Post,
  Req,
  Res,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { reportService } from './report.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { multerConfig } from 'src/config/multer.config';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('reports')
export class reportController {
  constructor(private reportService: reportService) {}

  // create report
  @Post('create')
  @UseInterceptors(FilesInterceptor('files', 5, multerConfig))
  async createReport(
    @Req() req: Request,
    @Res() res: Response,
    @Next() next: NextFunction,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return await this.reportService.createReport(req, res, next , files);
  }


  // report list
  @Get('list')
  @UseGuards(AuthGuard)
     async getReportList(
     @Req() req: Request,
     @Res() res: Response,
     @Next() next: NextFunction,
     ) {
     return await this.reportService.allReports(req, res, next);
     }
  
  // update report status
  @Post('update/status')
  @UseGuards(AuthGuard)
  async updateReportStatus(
    @Req() req: Request,
    @Res() res: Response,
    @Next() next: NextFunction,
  ) {
    return await this.reportService.updateReportStatus(req, res, next);
  }

  // send report on email
  @Post("/send/email")
  @UseGuards(AuthGuard)
  async sendReportOnEmail(
    @Req() req: Request,
    @Res() res: Response,
    @Next() next: NextFunction,
  ){
    return await this.reportService.sendReportEmailLink(req,res,next);
  }
}
