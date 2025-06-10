import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
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

  @Post('uploadFile/:versionId')
  @UseGuards(JwtGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile('file') file: Express.Multer.File,
    @Param('versionId') versionId: number,
  ) {
    const fileInfo = await firstValueFrom(
      this.fileServiceClient.send('files.uploadFile', file),
    );
    return firstValueFrom(
      this.apiServiceClient.send('versions.update', {
        versionId,
        updateData: { fileId: fileInfo.id },
      }),
    );
  }
}
