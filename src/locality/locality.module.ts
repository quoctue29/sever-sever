import { Module } from '@nestjs/common';
import { LocalityService } from './locality.service';
import { LocalityController } from './locality.controller';

@Module({
  imports: [],
  controllers: [LocalityController],
  providers: [LocalityService],
  exports: [LocalityService],
})
export class LocalityModule {}
