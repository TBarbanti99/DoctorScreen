import { Body, Controller, Next, Post, Req, Res, UseGuards , Put, UseInterceptors, UploadedFile } from "@nestjs/common";
import {  NextFunction, Request, Response } from "express";
import { userService } from "./user.service";
import { AuthGuard } from "src/guards/auth.guard";
import { FileInterceptor } from "@nestjs/platform-express";
import { multerConfig } from "src/config/multer.config";


@Controller("user")
export class userController{
    constructor(
        private userService: userService
    ){}

  // create User
  @Post("create")
  @UseInterceptors(FileInterceptor('file' , multerConfig))
  createUser(@Req() req : Request , @Res() res : Response ,@Next() next : NextFunction , @UploadedFile() file: Express.Multer.File){
    return this.userService.create(req, res, next , file)
  }

  // login user
  @Post("/login")
  loginUser(@Req() req : Request , @Res() res : Response ,@Next() next : NextFunction){
    return this.userService.login(req, res, next)
  }

  // refresh_token
  @Post("/refresh_token")
  refreshToken(@Req() req : Request , @Res() res : Response ,@Next() next : NextFunction){
    return this.userService.refreshToken(req, res, next)
  }

  // update the profile
  @Put("/update/profile")
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('file' , multerConfig))
  updateProfile(@Req() req : Request , @Res() res : Response ,@Next() next : NextFunction,@UploadedFile() file: Express.Multer.File){
    return this.userService.updateProfile(req, res, next,file)
  }

   // update password
   @Put("/update/password")
   @UseGuards(AuthGuard)
   updatePassword(@Req() req : Request , @Res() res : Response ,@Next() next : NextFunction){
     return this.userService.updatePassword(req, res, next)
   }

}