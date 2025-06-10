import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { mockAppDetail } from "@/lib/mocks";
import { XIcon } from "lucide-react";

export const AppSettingsImages = () => {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Зображення</h1>
      <form className="flex flex-col gap-4">
        <Input
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
          {mockAppDetail.appMedia?.map((media) => (
            <div
              key={media.id}
              className="w-32 h-32 bg-gray-100 rounded-lg overflow-hidden relative group"
            >
              <img
                src={media.mediaUrl}
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
