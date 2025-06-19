import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { CategoriesService } from './categories.service';

@Controller('categories')
export class CategoriesController {
  constructor(private categoryService: CategoriesService) {}

  @MessagePattern('categories.findAll')
  async findAll() {
    return this.categoryService.findAll();
  }
}
