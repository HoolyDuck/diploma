import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { FilesModule } from './files/files.module';

@Module({
  imports: [FilesModule],
  controllers: [],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class AppModule {}
