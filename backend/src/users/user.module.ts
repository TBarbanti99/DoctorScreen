import { Module } from "@nestjs/common";
import { userController } from "./user.controller";
import { userService } from "./user.service";
import { stripeService } from "src/stripe/stripr.service";



@Module({
    imports : [],
    controllers : [userController],
    providers : [userService , stripeService]
})
export class userModule {}