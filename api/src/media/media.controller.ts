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
}
