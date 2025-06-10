import type { Application } from "@/types/application/application.type";

export const mockApplications: Application[] = [
  {
    id: 1,
    userId: 101,
    title: "TaskMaster",
    description: "Планувальник завдань із підтримкою тайм-трекінгу.",
    type: "WEB",
    categories: [
      { id: 1, name: "Продуктивність" },
      { id: 2, name: "Інструменти" },
    ],
    downloads: 1240,
    iconMedia: {
      id: 10,
      mediaUrl:
        "https://img.icons8.com/?size=100&id=OErUPwxFhay7&format=png&color=000000",
    },
  },
  {
    id: 2,
    userId: 102,
    title: "PixelPainter",
    description: "Простий редактор піксельної графіки для художників.",
    type: "DESKTOP",
    categories: [
      { id: 3, name: "Графіка" },
      { id: 4, name: "Креативність" },
    ],
    downloads: 587,
    iconMedia: {
      id: 11,
      mediaUrl:
        "https://img.icons8.com/?size=100&id=U4STVDA0DXb7&format=png&color=000000",
    },
  },
  {
    id: 3,
    userId: 103,
    title: "FinanceTrack",
    description: "Ведення особистого бюджету з графіками витрат.",
    type: "WEB",
    categories: [{ id: 5, name: "Фінанси" }],
    downloads: 3120,
    iconMedia: {
      id: 12,
      mediaUrl:
        "https://img.icons8.com/?size=100&id=sOrE86GU7KfN&format=png&color=000000",
    },
  },
];

export const mockApplications2: Application[] = [
  {
    id: 4,
    userId: 104,
    title: "StudyBuddy",
    description: "Застосунок для створення флеш-карток і тестів.",
    type: "WEB",
    categories: [
      { id: 6, name: "Освіта" },
      { id: 2, name: "Інструменти" },
    ],
    downloads: 860,
    iconMedia: {
      id: 13,
      mediaUrl:
        "https://img.icons8.com/?size=100&id=46802&format=png&color=000000",
    },
  },
  {
    id: 5,
    userId: 105,
    title: "NoteSpace",
    description: "Кросплатформенний застосунок для заміток із синхронізацією.",
    type: "DESKTOP",
    categories: [
      { id: 1, name: "Продуктивність" },
      { id: 7, name: "Органайзери" },
    ],
    downloads: 1975,
    iconMedia: {
      id: 14,
      mediaUrl:
        "https://img.icons8.com/?size=100&id=nhRO70R1MM5K&format=png&color=000000",
    },
  },
  {
    id: 6,
    userId: 106,
    title: "FitTrack",
    description: "Трекер активностей та харчування з порадами зі здоров’я.",
    type: "WEB",
    categories: [
      { id: 8, name: "Здоров’я" },
      { id: 9, name: "Фітнес" },
    ],
    downloads: 1432,
    iconMedia: {
      id: 15,
      mediaUrl:
        "https://img.icons8.com/?size=100&id=swnnGPOYZChz&format=png&color=000000",
    },
  },
];

export const mockCategories = [
  { id: 1, name: "Продуктивність" },
  { id: 2, name: "Інструменти" },
  { id: 3, name: "Ігри" },
  { id: 4, name: "Мультимедіа" },
  { id: 5, name: "Соціальні мережі" },
  { id: 6, name: "Освіта" },
  { id: 7, name: "Органайзери" },
  { id: 8, name: "Здоров’я" },
  { id: 9, name: "Фітнес" },
  { id: 10, name: "Безпека" },
];

export const mockAppDetail: Application = {
  id: 1,
  userId: 101,
  type: "WEB",
  title: "TaskMaster",
  status: "IN_REVIEW",
  description: "Планувальник завдань із підтримкою тайм-трекінгу.",
  iconMedia: {
    id: 1,
    mediaUrl:
      "https://img.icons8.com/?size=100&id=OErUPwxFhay7&format=png&color=000000",
  },
  downloads: 1240,
  categories: [
    { id: 1, name: "Продуктивність" },
    { id: 2, name: "Інструменти" },
  ],
  rating: 4,
  reviews: [
    {
      id: 3,
      userId: 201,
      username: "Назарій",
      comment: "Круто!",
      rating: 5,
      createdAt: new Date(),
    },
    {
      id: 1,
      userId: 201,
      username: "John Doe",
      comment: "Чудовий застосунок для організації завдань!",
      rating: 5,
      createdAt: new Date("2023-10-01T12:00:00Z"),
    },
    {
      id: 2,
      userId: 202,
      username: "Jane Smith",
      comment: "Мені подобається, але є деякі недоліки.",
      rating: 3,
      createdAt: new Date("2023-10-02T12:00:00Z"),
    },
  ],
  appMedia: [
    {
      id: 1,
      mediaUrl:
        "https://is1-ssl.mzstatic.com/image/thumb/PurpleSource221/v4/57/56/4a/57564a3f-07fb-a87b-a5be-de463ef4c8d4/6f0e9cc8-1894-47d8-96d4-5a502bb45b58_App_store_-_Tracker_-_6.7_.png/300x0w.jpg",
    },
    {
      id: 2,
      mediaUrl:
        "https://is1-ssl.mzstatic.com/image/thumb/PurpleSource221/v4/57/56/4a/57564a3f-07fb-a87b-a5be-de463ef4c8d4/6f0e9cc8-1894-47d8-96d4-5a502bb45b58_App_store_-_Tracker_-_6.7_.png/300x0w.jpg",
    },
  ],
};
