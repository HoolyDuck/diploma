import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { FilesModule } from './files/files.module';
import { ClientsModule } from '@nestjs/microservices';

@Module({
  imports: [FilesModule, ClientsModule],
  controllers: [],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class AppModule {}
