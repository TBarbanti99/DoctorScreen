import { Module } from "@nestjs/common";
import { reportController } from "./report.controller";
import { reportService } from "./report.service";
import { stripeService } from "src/stripe/stripr.service";




@Module({
    imports: [],
    controllers: [reportController],
    providers: [reportService ,stripeService],
    exports: [],
})
export class ReportModule {}