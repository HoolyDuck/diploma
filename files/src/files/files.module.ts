import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  providers: [FilesService, PrismaService],
  controllers: [FilesController],
  imports: [
    ClientsModule.register([
      {
        name: 'API_SERVICE',
        transport: Transport.TCP,
        options: { port: 3002, host: '0.0.0.0' },
      },
    ]),
  ],
})
export class FilesModule {}
