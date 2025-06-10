import { Module } from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { ApplicationsController } from './applications.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [ApplicationsService, PrismaService],
  controllers: [ApplicationsController],
})
export class ApplicationsModule {}
