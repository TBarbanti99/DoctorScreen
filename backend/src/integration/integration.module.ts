import { Module } from "@nestjs/common";
import { IntegrationController } from "./integration.controller";
import { integrationService } from "./integration.service";
import { stripeService } from "src/stripe/stripr.service";



@Module({
    imports: [],
    controllers: [IntegrationController],
    providers: [integrationService ,stripeService],
    exports: []
})
export class IntegrationModule {}