import { Module } from '@nestjs/common';
import { ApplicationsModule } from './applications/applications.module';
import { MediaModule } from './media/media.module';
import { ApplicationsController } from './applications/applications.controller';
import { MediaController } from './media/media.controller';
import { ApplicationsService } from './applications/applications.service';
import { PrismaService } from './prisma/prisma.service';
import { MediaService } from './media/media.service';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { VersionsModule } from './versions/versions.module';
import { VersionsService } from './versions/versions.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ApplicationsModule,
    MediaModule,
    CloudinaryModule,
    VersionsModule,
  ],
  controllers: [ApplicationsController, MediaController],
  providers: [
    ApplicationsService,
    PrismaService,
    MediaService,
    VersionsService,
  ],
})
export class AppModule {}
