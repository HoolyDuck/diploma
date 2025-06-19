import {
  Controller,
  Delete,
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
    return updateResult;
  }

  @Post('uploadAppMedia/:applicationId')
  @UseInterceptors(FileInterceptor('file'))
  async uploadAppMedia(
    @UploadedFile() file: Express.Multer.File,
    @Param('applicationId') applicationId: number,
  ) {
    const result = await firstValueFrom(
      this.apiServiceClient.send('media.uploadAppMedia', {
        applicationId: +applicationId,
        file,
      }),
    );

    console.log('App media uploaded successfully:', result);
    return result;
  }

  @Delete('deleteAppMedia/:applicationId/:mediaId')
  async deleteAppMedia(
    @Param('applicationId') applicationId: number,
    @Param('mediaId') mediaId: number,
  ) {
    const result = await firstValueFrom(
      this.apiServiceClient.send('media.deleteAppMedia', {
        applicationId: +applicationId,
        mediaId: +mediaId,
      }),
    );

    console.log('App media deleted successfully:', result);
    return result;
  }
}
