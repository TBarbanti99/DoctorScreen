import { Module } from "@nestjs/common";
import { CalendlyController } from "./calendly.controller";
import { CalendlyService } from "./calendly.service";




@Module({
    imports: [],
    controllers: [CalendlyController],
    providers: [CalendlyService],
    exports: [],
})
export class CalendlyModule {}