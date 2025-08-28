import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { prismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [TasksService,prismaService]
})
export class TasksModule {}
