import { Button } from "@/components/ui/button";
import {
  useGetApplicationByIdQuery,
  useUpdateApplicationMutation,
} from "@/lib/api/api";
import { mockAppDetail } from "@/lib/mocks";
import { CheckIcon, DownloadIcon, Star } from "lucide-react";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";

const statusMap: Record<string, string> = {
  PUBLISHED: "Підтверджено",
  IN_REVIEW: "На розгляді",
  DRAFT: "Ще не розглянуто",
};

export const AppPublishPage = () => {
  const { appId } = useParams<{ appId: string }>();

  const { data: appSettings, isLoading: isLoadingAppSettings } =
    useGetApplicationByIdQuery(Number(appId), {
      skip: !appId,
      refetchOnFocus: true,
    });

  const [updateApplicationMutation] = useUpdateApplicationMutation();

  const approved = appSettings?.status === "PUBLISHED";
  const navigate = useNavigate();

  const handleSentForReview = async () => {
    if (!appId) return;

    try {
      await updateApplicationMutation({
        id: Number(appId),
        updateApplicationDto: {
          status: "IN_REVIEW",
        },
      }).unwrap();
      toast.success(
        "Застосунок успішно відправлено на розгляд. Очікуйте підтвердження."
      );
    } catch {
      toast.error(
        "Сталася помилка при відправці на розгляд. Спробуйте ще раз."
      );
    }
  };

  if (!approved)
    return (
      <div className="flex flex-col gap-4 p-6">
        <h1 className="text-2xl font-bold">Публікація</h1>
        <div>
          <p>
            Публікація застосунку дозволяє вам зробити його доступним для
            користувачів.
          </p>
          <p>Для публікації застосунку потрібно виконати наступні кроки:</p>
          <div className="flex flex-col gap-2 mt-4">
            <div className="flex items-center gap-2 ">
              <CheckIcon className="inline size-4 text-green-500" />
              <span className="text-gray-700 text-sm">
                Заповнити інформацію про застосунок
              </span>
            </div>
            <div className="flex items-center gap-2 ">
              <CheckIcon className="inline size-4 text-green-500" />
              <span className="text-gray-700 text-sm">
                Отримати підтвердження на файл версії
              </span>
            </div>
          </div>
        </div>
        <div>
          <Button
            variant="outline"
            onClick={() => navigate(`/apps/${appId}`)}
          >
            Попередній перегляд
          </Button>
          <Button
            className="ml-2"
            onClick={handleSentForReview}
            disabled={appSettings?.status === "IN_REVIEW"}
          >
            Подати на публікацію
          </Button>
        </div>
        <div>
          <h2 className="text-lg font-semibold">
            Статус підтвердження публікації:{" "}
            <span className="text-gray-500">
              {statusMap[appSettings?.status]}
            </span>
          </h2>
        </div>
      </div>
    );

  return (
    <div className="flex flex-col gap-2 p-6">
      <h1 className="text-2xl font-bold">Публікація</h1>

      <h2 className="text-lg font-semibold">{appSettings.title}</h2>

      <div className="flex gap-2">
        <div className="flex gap-2 items-center">
          <DownloadIcon className="inline size-4" />
          <span className="text-gray-700 text-sm">
            Завантаження: <span className="font-semibold">0</span>
          </span>
        </div>
        <div className="flex gap-2 items-center">
          <Star className="inline size-4 text-yellow-500" />
          <span className="text-gray-700 text-sm">
            Рейтинг: <span className="font-semibold">0.0</span>
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <h2>
          Стан публікації:{" "}
          <span className="text-green-500 font-semibold">Опубліковано</span>
        </h2>
        <a href={`/apps/${appId}`} target="_blank" rel="noopener noreferrer">
          <Button>
            Перейти на сторінку застосунку
          </Button>
        </a>
      </div>
    </div>
  );
};
