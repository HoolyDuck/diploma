export type Application = {
  id: number;
  userId: number;
  title: string;
  description?: string;
  type: "WEB" | "DESKTOP";
  status?: "IN_REVIEW" | "DRAFT" | "PUBLISHED" | "REJECTED";
  categories?: {
    id: number;
    name: string;
  }[];
  rating?: number;
  downloads: number;
  iconMedia?: {
    id: number;
    mediaUrl: string;
  };
  activeVersion?: {
    id: number;
    versionName: string;
    fileUrl: string;
  };
  reviews?: {
    id: number;
    username?: string;
    userId: number;
    rating: number;
    comment: string;
    createdAt: Date;
  }[];
  appMedia?: {
    id: number;
    mediaUrl: string;
  }[];
};
