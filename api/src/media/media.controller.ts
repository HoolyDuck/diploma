import { Controller } from '@nestjs/common';

import { MediaService } from './media.service';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller('media')
export class MediaController {
  constructor(private mediaService: MediaService) {}

  @MessagePattern('media.uploadFile')
  async uploadFile(@Payload() file: Express.Multer.File) {
    console.log('Received file:', file);
    const result = await this.mediaService.create(file);

    return result;
  }

  @MessagePattern('media.uploadAppMedia')
  async uploadAppMedia(
    @Payload('applicationId') applicationId: number,
    @Payload('file') file: Express.Multer.File,
  ) {
    console.log('Received file for app media:', file);
    const result = await this.mediaService.createAppMedia(applicationId, file);

    return result;
  }

  @MessagePattern('media.deleteAppMedia')
  async deleteAppMedia(
    @Payload('applicationId') applicationId: number,
    @Payload('mediaId') mediaId: number,
  ) {
    console.log(
      `Deleting media with ID ${mediaId} for application ID ${applicationId}`,
    );
    const result = await this.mediaService.deleteAppMedia(
      applicationId,
      mediaId,
    );

    return result;
  }
}
