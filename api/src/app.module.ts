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
import { ClientsModule, Transport } from '@nestjs/microservices';
import { CategoryModule } from './category/categories.module';
import { CategoriesService } from './category/categories.service';
import { CategoriesController } from './category/categories.controller';
import { ReviewModule } from './review/review.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ApplicationsModule,
    MediaModule,
    CloudinaryModule,
    VersionsModule,
    CategoryModule,
    ClientsModule.register([
      {
        name: 'FILE_SERVICE',
        transport: Transport.TCP,
        options: { port: 3003, host: '0.0.0.0' },
      },
    ]),
    ReviewModule,
  ],
  controllers: [ApplicationsController, MediaController, CategoriesController],
  providers: [
    ApplicationsService,
    PrismaService,
    MediaService,
    VersionsService,
    CategoriesService,
  ],
})
export class AppModule {}
