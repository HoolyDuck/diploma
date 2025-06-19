import { Injectable } from '@nestjs/common';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MediaService {
  constructor(
    private prisma: PrismaService,
    private cloudinaryService: CloudinaryService,
  ) {}

  async create(file: Express.Multer.File) {
    const imageUploadResult = await this.cloudinaryService.uploadImage(file);

    const result = await this.prisma.media.create({
      data: {
        mediaUrl: imageUploadResult.secure_url,
      },
    });

    return result;
  }

  async createAppMedia(applicationId: number, file: Express.Multer.File) {
    const imageUploadResult = await this.cloudinaryService.uploadImage(file);

    const result = await this.prisma.$transaction(async (prisma) => {
      const media = await prisma.media.create({
        data: {
          mediaUrl: imageUploadResult.secure_url,
        },
      });

      await prisma.appMedia.create({
        data: {
          applicationId,
          mediaId: media.id,
        },
      });
      return media;
    });

    return result;
  }

  async deleteAppMedia(applicationId: number, mediaId: number) {
    await this.prisma.appMedia.delete({
      where: {
        applicationId_mediaId: {
          applicationId,
          mediaId,
        },
      },
    });

    return { success: true };
  }
}
