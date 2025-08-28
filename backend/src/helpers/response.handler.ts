import { Response } from 'express';

interface sendResponseInterface {
    message: string;
    statusCode: number;
    data?: {};
    res: Response;
}

class ResponseHandler {
  sendResponse({ message, statusCode, res ,data }: sendResponseInterface) {
    res.status(statusCode).json({
      success: true,
      message,
      data,
    });
  }
}

export const responseHandler = new ResponseHandler()
