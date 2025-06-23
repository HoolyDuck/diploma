import { Controller } from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { MessagePattern } from '@nestjs/microservices';
import { CreateApplicationDto } from './dto/create-application.dto';
import { Prisma } from '@prisma/client';

@Controller('applications')
export class ApplicationsController {
  constructor(private applicationService: ApplicationsService) {}

  @MessagePattern('applications.findById')
  async findById(id: number) {
    return this.applicationService.findById(id);
  }

  @MessagePattern('applications.findMany')
  async findMany({
    skip,
    take,
    search,
    sortBy,
    sortOrder,
    categoryId,
  }: {
    skip?: number;
    take?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    categoryId?: number;
  }) {
    return this.applicationService.findMany(
      skip,
      take,
      search,
      sortBy,
      sortOrder,
      +categoryId,
    );
  }

  @MessagePattern('applications.findPopular')
  async findPopular({ take, skip }: { take?: number; skip?: number }) {
    return this.applicationService.findPopular(take, skip);
  }

  @MessagePattern('applications.findByDeveloperId')
  async findByDeveloperId(developerId: number) {
    return this.applicationService.findByDeveloperId(developerId);
  }

  @MessagePattern('applications.create')
  async create(createApplicationDto: CreateApplicationDto) {
    return this.applicationService.createApplication(createApplicationDto);
  }

  @MessagePattern('applications.update')
  async updateApplication({
    id,
    updateApplicationDto,
  }: {
    id: number;
    updateApplicationDto: Prisma.ApplicationUpdateInput;
  }) {
    return this.applicationService.updateApplication(id, updateApplicationDto);
  }

  @MessagePattern('applications.updateCategories')
  async updateCategories({
    id,
    categories,
  }: {
    id: number;
    categories: { id: number }[];
  }) {
    return this.applicationService.updateAppCategories(id, categories);
  }

  @MessagePattern('applications.createAppDownload')
  async createAppDownload({
    applicationId,
    userId,
  }: {
    applicationId: number;
    userId: number;
  }) {
    return this.applicationService.createAppDownload(applicationId, userId);
  }
}
