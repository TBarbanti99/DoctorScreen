import { Module } from "@nestjs/common";
import { patientController } from "./patient.controller";
import { patientService } from "./patient.service";




@Module({
    imports: [],
    controllers: [patientController],
    providers: [patientService],
})
export class PatientModule {}