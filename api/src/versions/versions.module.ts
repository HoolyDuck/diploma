import { Module } from '@nestjs/common';
import { VersionsController } from './versions.controller';
import { VersionsService } from './versions.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [VersionsController],
  providers: [VersionsService, PrismaService],
})
export class VersionsModule {}
