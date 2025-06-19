import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { JwtGuard } from './guards/jwt.guard';
import { firstValueFrom } from 'rxjs';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('version')
export class VersionController {
  constructor(
    @Inject('API_SERVICE') private apiServiceClient: ClientProxy,
    @Inject('FILE_SERVICE') private fileServiceClient: ClientProxy,
  ) {}

  @Get('findByAppId/:id')
  @UseGuards(JwtGuard)
  async findByAppId(@Param('id') id: number) {
    return firstValueFrom(
      this.apiServiceClient.send('versions.getByAppId', id),
    );
  }

  @Post('create/:appId')
  @UseGuards(JwtGuard)
  async createVersion(
    @Param('appId') appId: number,
    @Body('versionName') versionName: string,
  ) {
    return firstValueFrom(
      this.apiServiceClient.send('versions.create', { appId, versionName }),
    );
  }

  @Patch('sendForReview/:versionId')
  @UseGuards(JwtGuard)
  async sendForReview(@Param('versionId') versionId: number) {
    return firstValueFrom(
      this.apiServiceClient.send('versions.update', {
        versionId,
        updateData: { status: 'IN_REVIEW' },
      }),
    );
  }

  @Patch('setAsActive/:versionId')
  @UseGuards(JwtGuard)
  async setAsActive(
    @Param('versionId') versionId: number,
    @Body()
    body: {
      appId: number;
    },
  ) {
    return firstValueFrom(
      this.apiServiceClient.send('applications.update', {
        id: +body.appId,
        updateApplicationDto: { activeVersionId: +versionId },
      }),
    );
  }
}
