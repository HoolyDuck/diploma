import {
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Res,
  StreamableFile,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ClientProxy, MessagePattern, Payload } from '@nestjs/microservices';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Readable } from 'stream';
import { Response } from 'express';
import { firstValueFrom } from 'rxjs';

@Controller('files')
export class FilesController {
  constructor(
    private readonly fileService: FilesService,
    @Inject('API_SERVICE') private apiServiceClient: ClientProxy,
  ) {}

  @Post('uploadVersion/:versionId/:token')
  @UseInterceptors(FileInterceptor('file'))
  async upload(
    @UploadedFile('file') file: Express.Multer.File,
    @Param('token') token: string,
    @Param('versionId') versionId: string,
  ) {
    const result = await this.fileService.saveFile(file, token);

    const res = await firstValueFrom(
      this.apiServiceClient.send('versions.update', {
        versionId,
        updateData: {
          fileId: result.id,
        },
      }),
    );

    return res;
  }

  @Get('download/:id/:token')
  async getFile(
    @Param('id') id: string,
    @Param('token') token: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const file = await this.fileService.getFileById(id, token);

    console.log(`Downloading file: ${file}`);

    res.set({
      'Content-Type': file.mimetype,
      'Content-Disposition': `attachment; filename="${file.originalName}"`,
    });

    const fileStream = Readable.from(Buffer.from(file.buffer));

    return new StreamableFile(fileStream);
  }

  @MessagePattern('files.generateFileSignature')
  async generateFileSignature() {
    return this.fileService.generateFileSignature();
  }

  @MessagePattern('files.getFileInfoById')
  async getFileInfo(@Payload() id: string) {
    return this.fileService.getFileInfoById(id);
  }

  @MessagePattern('files.getFileInfosByIds')
  async getFileInfos(@Payload() ids: string[]) {
    return this.fileService.getFileInfosByIds(ids);
  }
}
