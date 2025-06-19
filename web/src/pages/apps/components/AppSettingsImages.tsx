import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUploadFile } from "@/hooks/useUploadFile";
import { useGetApplicationByIdQuery } from "@/lib/api/api";
import { XIcon } from "lucide-react";
import { useParams } from "react-router";
import { toast } from "sonner";

export const AppSettingsImages = () => {
  const { appId } = useParams<{ appId: string }>();

  const { data: appSettings } = useGetApplicationByIdQuery(Number(appId), {
    skip: !appId,
  });

  const { uploadFile } = useUploadFile();

  const handleFileUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const file = formData.get("file") as File;

    if (!file) {
      return;
    }

    try {
      await uploadFile(file, `media/uploadAppMedia/${appId}`);
      toast.success("Зображення успішно завантажено!");
    } catch {
      toast.error("Помилка при завантаженні зображення.");
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Зображення</h1>
      <form
        className="flex flex-col gap-4"
        onSubmit={handleFileUpload}
      >
        <Input
          name="file"
          type="file"
          accept="image/*"
        />
        <p className="text-sm text-muted-foreground">
          Рекомендований розмір: менше 5 МБ. Підтримуються формати PNG, JPG,
          WEBP.
        </p>
        <Button className="w-fit">Додати зображення</Button>
      </form>
      <div className="mt-4">
        <h2 className="text-lg font-semibold">Завантажені зображення</h2>
        <div className="flex flex-wrap gap-4 mt-2">
          {/* Placeholder for uploaded images */}
          {appSettings.AppMedia?.map((media) => (
            <div
              key={media.id}
              className="w-32 h-32 bg-gray-100 rounded-lg overflow-hidden relative group"
            >
              <img
                src={media.media.mediaUrl}
                className="w-full h-full object-cover"
              />
              <XIcon
                className="absolute top-2 right-2 size-6 text-red-500 opacity-0 group-hover:opacity-100 cursor-pointer"
                onClick={() => console.log("Delete image", media.id)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
