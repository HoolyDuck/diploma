import {
  Controller,
  Get,
  Header,
  Inject,
  Param,
  Res,
  StreamableFile,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { Response } from 'express';
import { Readable } from 'stream';

@Controller('files')
export class FilesController {
  constructor(@Inject('FILE_SERVICE') private fileServiceClient: ClientProxy) {}

  @Get('download/:id')
  async downloadFile(
    @Param('id') id: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const file = await firstValueFrom(
      this.fileServiceClient.send('files.getFileById', id),
    );

    console.log('File retrieved:', file);

    res.set({
      'Content-Type': file.mimeType,
      'Content-Disposition': `attachment; filename="${file.originalName}"`,
    });

    const fileStream = Readable.from(Buffer.from(file.buffer));

    return new StreamableFile(fileStream);
  }
}
