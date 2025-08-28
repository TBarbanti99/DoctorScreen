import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Observable } from "rxjs";
import { prismaService } from "src/prisma/prisma.service";



@Injectable()
export class AuthGuard implements CanActivate{
    constructor(
        private jwt : JwtService,
        private Prisma : prismaService
    ){}

    async canActivate(context: ExecutionContext){
        const request = context.switchToHttp().getRequest();
        const token = request.headers.authorization?.split(' ')[1];

        if(!token){
            throw new UnauthorizedException("No token provided")
        }

        try {

            const payload  = await this.jwt.verifyAsync(token,{
                secret : process.env.JWT_SECRET
            })

            // find user by id
            const user = await this.Prisma.user.findFirst({
                where : {
                    id : payload.id
                }
            })

            if(!user){
                throw new UnauthorizedException("User not found")
            }
            request.user = user;
            return true;
        } catch (error) {
            throw new UnauthorizedException(error.message || "Invalid token")
            
        }
    }

}