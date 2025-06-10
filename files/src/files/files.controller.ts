import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { FilesService } from './files.service';

@Controller('files')
export class FilesController {
  constructor(private readonly fileService: FilesService) {}

  @MessagePattern('files.uploadFile')
  async upload(@Payload() file: Express.Multer.File) {
    return this.fileService.saveFile(file);
  }

  @MessagePattern('files.getFileById')
  async getFile(@Payload() id: string) {
    return this.fileService.getFileById(id);
  }
}
