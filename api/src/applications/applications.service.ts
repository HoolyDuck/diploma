import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateApplicationDto } from './dto/create-application.dto';

@Injectable()
export class ApplicationsService {
  constructor(private prisma: PrismaService) {}

  async findById(id: number) {
    const result = this.prisma.application.findUnique({
      where: { id },
      include: {
        iconMedia: true,
        activeVersion: true,
        AppCategory: {
          include: {
            category: true,
          },
        },
        reviews: true,
      },
    });

    return result;
  }

  async findByIdForDeveloper(id: number) {
    const result = this.prisma.application.findUnique({
      where: { id },
      include: {
        iconMedia: true,
        activeVersion: true,
        AppCategory: {
          include: {
            category: true,
          },
        },
        versions: true,
      },
    });

    return result;
  }

  async findByUserId(userId: number) {
    const result = this.prisma.application.findMany({
      where: { userId },
      include: {
        iconMedia: true,
      },
    });

    return result;
  }

  async findMany(
    skip?: number,
    take?: number,
    search?: string,
    sortBy?: string,
    sortOrder?: 'asc' | 'desc',
  ) {
    const where: Prisma.ApplicationWhereInput = search
      ? {
          title: {
            startsWith: search,
            mode: 'insensitive',
          },
        }
      : {};

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
      include: {
        iconMedia: true,
        activeVersion: true,
      },
    });

    console.log('findMany', result);

    return result;
  }

  async findByDeveloperId(developerId: number, skip?: number, take?: number) {
    const result = await this.prisma.application.findMany({
      where: { userId: developerId },
      include: {
        iconMedia: true,
        activeVersion: true,
      },
      skip,
      take,
    });

    return result;
  }

  async getReviews(applicationId: number) {
    const reviews = await this.prisma.review.findMany({
      where: { applicationId },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return reviews;
  }

  async createApplication(data: CreateApplicationDto) {
    const newApplication = await this.prisma.application.create({
      data: {
        userId: data.userId,
        title: data.title,
        type: data.type,
      },
    });

    return newApplication;
  }

  async updateApplication(id: number, data: Prisma.ApplicationUpdateInput) {
    const updatedApplication = await this.prisma.application.update({
      where: { id },
      data,
    });

    return updatedApplication;
  }
}
