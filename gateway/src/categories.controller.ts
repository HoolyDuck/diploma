import { Controller, Get, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Controller('categories')
export class CategoriesController {
  constructor(
    @Inject('API_SERVICE') private readonly apiServiceClient: ClientProxy,
  ) {}

  @Get('findAll')
  async findAll() {
    return firstValueFrom(this.apiServiceClient.send('categories.findAll', {}));
  }
}
