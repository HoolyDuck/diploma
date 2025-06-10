import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { CategoryService } from './category.service';

@Controller('category')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @MessagePattern('category.findAll')
  async findAll() {
    return this.categoryService.findAll();
  }
}
