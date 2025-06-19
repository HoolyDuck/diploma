import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateVersionDto } from './dto/create-version.dto';
import { Prisma } from '@prisma/client';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class VersionsService {
  constructor(
    private prismaService: PrismaService,
    @Inject('FILE_SERVICE') private readonly fileServiceClient: ClientProxy,
  ) {}

  async getVersionsByAppId(appId: number) {
    const result = await this.prismaService.version.findMany({
      where: { applicationId: +appId },
      orderBy: { createdAt: 'desc' },
    });

    const fileIds = result.map((version) => version.fileId).filter(Boolean);
    const files = await firstValueFrom(
      this.fileServiceClient.send('files.getFileInfosByIds', fileIds),
    );

    console.log('Files for versions:', files);

    return result.map((version) => {
      const file = files.find((f) => f.id === version.fileId);
      return {
        ...version,
        file: file || null,
      };
    });
  }

  async create(appId: number, { versionName }: CreateVersionDto) {
    return this.prismaService.version.create({
      data: {
        applicationId: +appId,
        versionName,
      },
    });
  }

  async update(versionId: number, updateData: Prisma.VersionUpdateInput) {
    return this.prismaService.version.update({
      where: { id: +versionId },
      data: updateData,
    });
  }

  async updateVersionFile(fiLe: Express.Multer.File, versionId: number) {
    const file = await firstValueFrom(
      this.fileServiceClient.send('files.uploadFile', fiLe),
    );

    if (!file) {
      throw new Error('File u pload failed');
    }

    return this.prismaService.version.update({
      where: { id: +versionId },
      data: {
        fileId: file.id,
      },
    });
  }
}
