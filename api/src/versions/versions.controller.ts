import { Controller } from '@nestjs/common';
import { VersionsService } from './versions.service';
import { MessagePattern } from '@nestjs/microservices';
import { Prisma } from '@prisma/client';

@Controller('versions')
export class VersionsController {
  constructor(private versionsService: VersionsService) {}

  @MessagePattern('versions.getByAppId')
  async getVersionsByAppId(appId: number) {
    return this.versionsService.getVersionsByAppId(appId);
  }

  @MessagePattern('versions.create')
  async createVersion({
    appId,
    versionName,
  }: {
    appId: number;
    versionName: string;
  }) {
    return this.versionsService.create(appId, { versionName });
  }

  @MessagePattern('versions.update')
  async updateVersion({
    versionId,
    updateData,
  }: {
    versionId: number;
    updateData: Prisma.VersionUpdateInput;
  }) {
    return this.versionsService.update(versionId, updateData);
  }
}
