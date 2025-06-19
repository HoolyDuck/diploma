import { Controller, Get, Inject, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

import { JwtGuard } from './guards/jwt.guard';

@Controller('files')
export class FilesController {
  constructor(@Inject('FILE_SERVICE') private fileServiceClient: ClientProxy) {}

  @Get('generateFileSignature')
  @UseGuards(JwtGuard)
  async getFileSignature(): Promise<{
    signature: string;
  }> {
    return {
      signature: await firstValueFrom(
        this.fileServiceClient.send('files.generateFileSignature', {}),
      ),
    };
  }
}
