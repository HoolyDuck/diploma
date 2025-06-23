import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { JwtGuard } from './guards/jwt.guard';
import { GetUser } from './decorators/get-user.decorator';

type FindManyParams = {
  skip?: number;
  take?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
};

@Controller('application')
export class ApplicationController {
  constructor(
    @Inject('API_SERVICE') private readonly apiServiceClient: ClientProxy,
  ) {}

  @Get('findById/:id')
  async findById(@Param('id') id: number) {
    return firstValueFrom(
      this.apiServiceClient.send('applications.findById', +id),
    );
  }

  @Get('findForDeveloper')
  @UseGuards(JwtGuard)
  async findForDeveloper(@GetUser() user: { id: number }) {
    return firstValueFrom(
      this.apiServiceClient.send('applications.findByDeveloperId', user.id),
    );
  }

  @Get('findByIdForDeveloper/:id')
  async findByIdForDeveloper(@Param('id') id: number) {
    return firstValueFrom(
      this.apiServiceClient.send('applications.findByIdForDeveloper', id),
    );
  }

  @Get('findMany')
  async findMany(
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    @Query('search') search?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: 'asc' | 'desc',
    @Query('categoryId') categoryId?: number,
  ) {
    console.log('findMany called with params:', {
      skip,
      take,
      search,
      sortBy,
      sortOrder,
      categoryId,
    });
    const result = await firstValueFrom(
      this.apiServiceClient.send('applications.findMany', {
        skip: skip ? +skip : undefined,
        take: take ? +take : undefined,
        search,
        sortBy,
        sortOrder,
        categoryId,
      }),
    );

    return result;
  }

  @Get('findPopular')
  async findPopular(@Query('take') take: string, @Query('skip') skip: string) {
    console.log('findPopular called with params:', { take, skip });
    return firstValueFrom(
      this.apiServiceClient.send('applications.findPopular', {
        take: +take || 10,
        skip: +skip || 0,
      }),
    );
  }

  @Post('')
  @UseGuards(JwtGuard)
  async createApplication(
    @Body() createApplicationDto: any,
    @GetUser() user: { id: number },
  ) {
    return firstValueFrom(
      this.apiServiceClient.send('applications.create', {
        ...createApplicationDto,
        userId: user.id,
      }),
    );
  }

  @Patch('update/:id')
  @UseGuards(JwtGuard)
  async updateApplication(
    @Param('id') id: number,
    @Body() updateApplicationDto: any,
  ) {
    return firstValueFrom(
      this.apiServiceClient.send('applications.update', {
        id: +id,
        updateApplicationDto,
      }),
    );
  }

  @Get('reviews/:id')
  async getReviews(@Param('id') id: number) {
    return firstValueFrom(
      this.apiServiceClient.send('review.getReviewsByAppId', +id),
    );
  }

  @Post('createReview/:id')
  @UseGuards(JwtGuard)
  async createReview(
    @Param('id') id: number,
    @Body() createReviewDto: { rating: number; comment: string },
    @GetUser() user: { id: number },
  ) {
    return firstValueFrom(
      this.apiServiceClient.send('review.createReview', {
        appId: +id,
        userId: user.id,
        ...createReviewDto,
      }),
    );
  }

  @Patch('updateInfo/:id')
  @UseGuards(JwtGuard)
  async updateApplicationInfo(
    @Param('id') id: number,
    @Body()
    updateApplicationDto: {
      title: string;
      description: string;
      categories: { id: number }[];
    },
  ) {
    await firstValueFrom(
      this.apiServiceClient.send('applications.updateCategories', {
        id: +id,
        categories: updateApplicationDto.categories,
      }),
    );

    return firstValueFrom(
      this.apiServiceClient.send('applications.update', {
        id: +id,
        updateApplicationDto: {
          title: updateApplicationDto.title,
          description: updateApplicationDto.description,
        },
      }),
    );
  }

  @Patch('createAppDownload/:id')
  @UseGuards(JwtGuard)
  async createAppDownload(
    @Param('id') id: number,
    @GetUser() user: { id: number },
  ) {
    return firstValueFrom(
      this.apiServiceClient.send('applications.createAppDownload', {
        applicationId: +id,
        userId: user.id,
      }),
    );
  }
}
