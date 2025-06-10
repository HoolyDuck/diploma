import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUploadFile } from "@/hooks/useUploadFile";
import { useState } from "react";
import { useParams } from "react-router";

type Props = {
  mediaUrl?: string;
};

export const AppSettingsIcon: React.FC<Props> = ({ mediaUrl }) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(mediaUrl || null);
  const [file, setFile] = useState<File | null>(null);
  const { appId } = useParams<{ appId: string }>();

  const { uploadFile } = useUploadFile();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    // Upload logic here
    uploadFile(file, `media/uploadIcon/${appId}`)
      .then((response) => {
        console.log("File uploaded successfully:", response);
      })
      .catch((error) => {
        console.error("Error uploading file:", error);
      });
    console.log("Uploading:", file);
  };

  return (
    <div className="grid grid-cols-3 gap-4">
      <h1 className="text-2xl font-bold col-span-2">Іконка</h1>
      <form
        onSubmit={handleSubmit}
        className="grid-cols-2 col-span-2"
      >
        <Input
          type="file"
          accept="image/*"
          className="w-full"
          onChange={handleFileChange}
        />
        <p className="text-sm text-muted-foreground mt-2">
          Рекомендований розмір: 128x128 пікселів. Підтримуються формати PNG, JPG, SVG.
        </p>
        <Button
          type="submit"
          className=" mt-2"
        >
          Завантажити
        </Button>
      </form>
      <div className="flex items-center justify-center h-32 border border-dashed rounded-lg">
        {previewUrl ? (
          <img
            src={previewUrl}
            alt="Preview"
            className="object-contain w-full h-full"
          />
        ) : (
          <span className="text-muted-foreground text-sm">
            No image selected
          </span>
        )}
      </div>
    </div>
  );
};
