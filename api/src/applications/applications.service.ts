import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { mapToApplicationDto } from './mappers/applications.mapper';

const includeOptions: Prisma.ApplicationInclude = {
  iconMedia: true,
  activeVersion: true,
  AppCategory: {
    include: {
      category: true,
    },
  },
  reviews: true,
  AppMedia: {
    include: {
      media: true,
    },
  },
  AppDownload: true,
};

@Injectable()
export class ApplicationsService {
  constructor(private prisma: PrismaService) {}

  async findById(id: number) {
    const result = await this.prisma.application.findUnique({
      where: { id },
      include: includeOptions,
    });

    return mapToApplicationDto(result);
  }

  async findByUserId(userId: number) {
    const result = await this.prisma.application.findMany({
      where: { userId },
      include: includeOptions,
    });

    return result.map(mapToApplicationDto);
  }

  async findMany(
    skip?: number,
    take?: number,
    search?: string,
    sortBy?: string,
    sortOrder?: 'asc' | 'desc',
    categoryId?: number,
  ) {
    const where: Prisma.ApplicationWhereInput = {
      ...(search && {
        title: {
          contains: search,
          mode: 'insensitive',
        },
      }),
      ...(categoryId && {
        AppCategory: {
          some: {
            categoryId,
          },
        },
      }),
    };

    const orderBy = sortBy
      ? {
          [sortBy]: sortOrder || 'asc',
        }
      : undefined;

    const result = await this.prisma.application.findMany({
      skip,
      take,
      where,
      orderBy,
      include: includeOptions,
    });

    console.log('findMany', result);

    return result.map(mapToApplicationDto);
  }

  async findPopular(take?: number, skip?: number) {
    console.log('findPopular called with:', { take, skip });
    const result = await this.prisma.application.findMany({
      take,
      skip,
      orderBy: {
        downloads: 'desc',
      },
      include: includeOptions,
    });

    return result.map(mapToApplicationDto);
  }

  async findByDeveloperId(developerId: number, skip?: number, take?: number) {
    const result = await this.prisma.application.findMany({
      where: { userId: developerId },
      include: includeOptions,
      skip,
      take,
    });

    return result.map(mapToApplicationDto);
  }

  async createApplication(data: CreateApplicationDto) {
    const newApplication = await this.prisma.application.create({
      data: {
        userId: data.userId,
        title: data.title,
        type: data.type,
      },
      include: includeOptions,
    });

    return newApplication;
  }

  async updateApplication(id: number, data: Prisma.ApplicationUpdateInput) {
    const updatedApplication = await this.prisma.application.update({
      where: { id },
      data,
      include: includeOptions,
    });

    return updatedApplication;
  }

  async updateAppCategories(
    applicationId: number,
    categories: { id: number }[],
  ) {
    const result = this.prisma.$transaction(async (prisma) => {
      const result = await prisma.appCategory.deleteMany({
        where: { applicationId },
      });

      const appCategories = categories.map((category) => ({
        applicationId,
        categoryId: category.id,
      }));

      return prisma.appCategory.createMany({
        data: appCategories,
      });
    });

    return result;
  }

  async createAppDownload(applicationId: number, userId: number) {
    const app = await this.prisma.application.findUnique({
      where: { id: applicationId },
    });

    return await this.prisma.application.update({
      where: { id: applicationId },
      data: {
        downloads: app.downloads + 1,
      },
      include: includeOptions,
    });
  }
}
