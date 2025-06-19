import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  providers: [ReviewService, PrismaService],
  controllers: [ReviewController],
  imports: [
    ClientsModule.register([
      {
        name: 'AUTH_SERVICE',
        transport: Transport.TCP,
        options: { port: 3001, host: '0.0.0.0' },
      },
    ]),
  ],
})
export class ReviewModule {}
