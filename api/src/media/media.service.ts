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
}
