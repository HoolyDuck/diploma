import { Prisma } from '@prisma/client';

type ApplicationDto = Omit<
  Prisma.ApplicationGetPayload<{
    include: Prisma.ApplicationInclude;
  }> & {
    averageRating: number;
    downloadsCount: number;
  },
  'AppDownload'
>;

export const mapToApplicationDto = (
  application: Prisma.ApplicationGetPayload<{
    include: Prisma.ApplicationInclude;
  }>,
): ApplicationDto => {
  const result = {
    ...application,
    averageRating:
      application.reviews.reduce((acc, review) => acc + review.rating, 0) /
      (application.reviews.length || 1),
    downloadsCount: application.AppDownload.length,
  };

  delete result.AppDownload;
  delete result.reviews;

  return result;
};
