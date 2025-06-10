import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateVersionDto } from './dto/create-version.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class VersionsService {
  constructor(private prismaService: PrismaService) {}

  async getVersionsByAppId(appId: number) {
    return this.prismaService.version.findMany({
      where: { applicationId: +appId },
      orderBy: { createdAt: 'desc' },
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
}
