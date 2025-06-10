import { Module } from '@nestjs/common';
import { ConfigService } from './config/config.service';
import { ClientsModule } from '@nestjs/microservices';
import { AuthController } from './auth.controller';
import { ConfigModule } from './config/config.module';
import { ApplicationController } from './application.controller';
import { MediaController } from './media.controller';
import { VersionController } from './version.controller';
import { FilesController } from './files.controller';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        imports: [ConfigModule],
        name: 'AUTH_SERVICE',
        useFactory: async (configService: ConfigService) => ({
          transport: configService.get('authService.transport'),
          options: {
            host: '0.0.0.0',
            port: 3001,
          },
        }),
        inject: [ConfigService],
      },
      {
        imports: [ConfigModule],
        name: 'API_SERVICE',
        useFactory: async (configService: ConfigService) => ({
          transport: configService.get('authService.transport'),
          options: {
            host: '0.0.0.0',
            port: 3002,
          },
        }),
        inject: [ConfigService],
      },
      {
        imports: [ConfigModule],
        name: 'FILE_SERVICE',
        useFactory: async (configService: ConfigService) => ({
          transport: configService.get('authService.transport'),
          options: {
            host: '0.0.0.0',
            port: 3003,
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [
    AuthController,
    ApplicationController,
    MediaController,
    VersionController,
    FilesController,
  ],
  providers: [ConfigService],
})
export class AppModule {}
