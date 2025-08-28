import { HttpException } from "@nestjs/common";

export class ErrorHandler extends  HttpException{
    message: string;
    statusCode: number;
    constructor(message: string, statusCode: number){
        super(message,statusCode)
        this.message = message || "Internal Server Error";
        this.statusCode = statusCode || 500;
        Error.captureStackTrace(this, this.constructor);
    }
}