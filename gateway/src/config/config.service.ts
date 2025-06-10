import { Transport } from '@nestjs/microservices';

export class ConfigService {
  private readonly envConfig: { [key: string]: any };

  constructor() {
    this.envConfig = {
      PORT: process.env.GATEWAY_PORT || '3000',
      authService: {
        options: {
          host: process.env.AUTH_SERVICE_HOST || 'localhost',
          port: process.env.AUTH_SERVICE_PORT || '3001',
        },
        transport: Transport.TCP,
      },
    };
  }

  get(key: string): any {
    return this.envConfig[key];
  }
}
