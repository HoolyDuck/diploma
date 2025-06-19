import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ReviewService {
  constructor(
    private prisma: PrismaService,
    @Inject('AUTH_SERVICE') private readonly authServiceClient: ClientProxy,
  ) {}

  async getReviewsByAppId(appId: number) {
    const reviews = await this.prisma.review.findMany({
      where: { applicationId: +appId },
      orderBy: { createdAt: 'desc' },
    });

    const userIds = reviews.map((review) => review.userId).filter(Boolean);
    const users = await firstValueFrom(
      this.authServiceClient.send('users.getManyByIds', userIds),
    );

    return reviews.map((review) => {
      const user = users.find((u) => u.id === review.userId);
      return {
        ...review,
        user: user || null,
      };
    });
  }

  async createReview(
    appId: number,
    userId: number,
    { rating, comment }: { rating: number; comment: string },
  ) {
    return this.prisma.review.create({
      data: {
        applicationId: +appId,
        userId: +userId,
        rating,
        comment,
      },
    });
  }
}
