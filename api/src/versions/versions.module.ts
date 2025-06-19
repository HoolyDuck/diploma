import { Module } from '@nestjs/common';
import { VersionsController } from './versions.controller';
import { VersionsService } from './versions.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  controllers: [VersionsController],
  providers: [VersionsService, PrismaService],
  imports: [
    ClientsModule.register([
      {
        name: 'FILE_SERVICE',
        transport: Transport.TCP,
        options: { port: 3003, host: '0.0.0.0' },
      },
    ]),
  ],
})
export class VersionsModule {}
