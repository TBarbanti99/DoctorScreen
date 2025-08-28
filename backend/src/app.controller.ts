import { Controller, Get, Next, Req, Res, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard } from './guards/auth.guard';
import { NextFunction, Request, Response } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('dashboard')
  @UseGuards(AuthGuard)
  async getDashboardData(@Req() req: Request,@Res() res: Response,@Next() next: NextFunction) {
    return this.appService.getDashboardData(req, res, next);
  }
}
