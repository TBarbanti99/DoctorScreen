import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { prismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(private readonly prisma: prismaService) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async handleDeleteUnpaidUsers() {
    const now = new Date();
    
    const users = await this.prisma.user.findMany({
      where: {
        status: 'UNPAID',
      },
    });

    for (const user of users) {
      const createdPlus10Min = new Date(user.createdAt.getTime() + 5 * 60 * 1000);
      if (createdPlus10Min < now) {
        await this.prisma.user.delete({ where: { id: user.id } });
        this.logger.log(`Deleted unpaid user: ${user.email}, createdAt: ${user.createdAt.toISOString()}`);
      } else {
        this.logger.log(`Skipped user: ${user.email}, not yet expired. Expires at: ${createdPlus10Min.toISOString()}`);
      }
    }
  }
}
