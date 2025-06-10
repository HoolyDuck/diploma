import {
  Controller,
  Inject,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { FileInterceptor } from '@nestjs/platform-express';
import { firstValueFrom } from 'rxjs';

@Controller('media')
export class MediaController {
  constructor(@Inject('API_SERVICE') private apiServiceClient: ClientProxy) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    const result = await firstValueFrom(
      this.apiServiceClient.send('media.uploadFile', file),
    );

    console.log('File uploaded successfully:', result);
  }

  @Post('uploadIcon/:applicationId')
  @UseInterceptors(FileInterceptor('file'))
  async uploadIcon(
    @UploadedFile() file: Express.Multer.File,
    @Param('applicationId') applicationId: number,
  ) {
    const { id } = await firstValueFrom(
      this.apiServiceClient.send('media.uploadFile', file),
    );

    const updateResult = await firstValueFrom(
      this.apiServiceClient.send('applications.update', {
        id: +applicationId,
        updateApplicationDto: {
          iconMediaId: +id,
        },
      }),
    );

    console.log('Icon uploaded successfully:', updateResult);
  }
}
