import { NextFunction, Request } from "express";
import { ErrorHandler } from "./error.handler";



export class BodyValidator{
    public static validateBody(req : Request, schema : Array<string> , next :NextFunction){
        if(!req.body){
            return 'Missing request body'
        }

        // fist check is there is other field in body if exist then return error
        const otherFields = Object.keys(req.body).filter(field => !schema.includes(field));
        if(otherFields.length > 0){
            return `Invalid field(s) in request body: ${otherFields.join(', ')}`
        }
      
        for(let field of schema){
            if(!req.body[field]){
                return `Missing required field: ${field}`

            }
        }
          // validate email
          if(schema.includes("email")){
              if(!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(req.body.email)){
                    return 'Invalid email format'
              }
          }
      
    }
}

