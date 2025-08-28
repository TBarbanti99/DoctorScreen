import { Module } from '@nestjs/common';
import { stripeController } from './stripe.controller';
import { stripeService } from './stripr.service';

@Module({
  imports: [],
  controllers: [stripeController],
  providers: [stripeService],
  exports: [],
})
export class stripeModule {}
