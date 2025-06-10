import { ApplicationType } from '@prisma/client';

export class CreateApplicationDto {
  userId: number;
  title: string;
  type: ApplicationType;
}
