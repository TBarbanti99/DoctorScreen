import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { userModule } from './users/user.module';
import { prismaModule } from './prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { PatientModule } from './patient/patient.module';
import { ReportModule } from './reports/report.module';
import { IntegrationModule } from './integration/integration.module';
import { CalendlyModule } from './calendly/calendly.module';
import { stripeModule } from './stripe/stripe.module';
import { ScheduleModule } from '@nestjs/schedule';
import { TasksModule } from './tasks/tasks.module';

@Module({
  imports: [
    ConfigModule.forRoot({
    isGlobal: true,
  }),
  userModule,
  PatientModule,
  ReportModule,
  prismaModule,
  IntegrationModule,
  CalendlyModule,
  JwtModule.register({
    global: true,
    secret: process.env.JWT_SECRET!,
  }),
  ServeStaticModule.forRoot({
    rootPath: join(__dirname, '../', "../", 'uploads'),
    serveRoot: '/uploads',
  }),
  stripeModule,
  ScheduleModule.forRoot(),
  TasksModule,
],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
