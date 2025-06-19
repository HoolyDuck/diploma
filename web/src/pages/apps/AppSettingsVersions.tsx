import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useUploadFile } from "@/hooks/useUploadFile";
import {
  useCreateVersionMutation,
  useGetApplicationByIdQuery,
  useGetAppVersionsQuery,
  useSendVersionForReviewMutation,
  useSetActiveVersionMutation,
} from "@/lib/api/api";
import { Lock } from "lucide-react";
import { useState } from "react";
import { useParams } from "react-router";
import { toast } from "sonner";

const activeVersion = {
  id: 1,
  version: "1.0.0",
  createdAt: "2023-10-01",
  status: "PUBLISHED",
};

const versionsMock = [
  {
    id: 1,
    version: "1.0.0",
    createdAt: "2023-10-01",
    status: "PUBLISHED",
  },
  {
    id: 2,
    version: "1.1.0",
    createdAt: "2025-10-15",
    status: "NO_REVIEW",
  },
];

const statusMap: Record<string, string> = {
  PUBLISHED: "Підтверджено",
  IN_REVIEW: "На розгляді",
  DRAFT: "Ще не розглянуто",
};

const VersionCard: React.FC<{ version: typeof activeVersion }> = ({
  version,
}) => {
  const { appId } = useParams<{ appId: string }>();
  const [isUpdateFile, setIsUpdateFile] = useState(false);
  const { uploadVersionFile } = useUploadFile();
  const [sendVersionForReviewMutation, { isLoading: isSendingReview }] =
    useSendVersionForReviewMutation();
  const [setActiveVersionMutation, { isLoading: isSettingActiveVersion }] =
    useSetActiveVersionMutation();

  const handleFileUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const file = formData.get("version-file") as File;

    if (!file) {
      toast.error("Please select a file to upload");
      return;
    }

    try {
      await uploadVersionFile(file, version.id);
      toast.success("Файл успішно завантажено");
      setIsUpdateFile(false);
    } catch {
      toast.error("Помилка при завантаженні файлу. Спробуйте ще раз.");
    }
  };

  const handleSendForReview = async () => {
    try {
      await sendVersionForReviewMutation(version.id).unwrap();
      toast.success("Версію відправлено на розгляд");
    } catch {
      toast.error("Не вдалося відправити версію на розгляд. Спробуйте ще раз.");
    }
  };

  const handleSetActiveVersion = async () => {
    try {
      await setActiveVersionMutation({
        appId: Number(appId),
        versionId: version.id,
      }).unwrap();
      toast.success("Версію встановлено активною");
    } catch {
      toast.error("Не вдалося встановити версію активною. Спробуйте ще раз.");
    }
  };

  return (
    <div className="p-4 border rounded-md flex items-center justify-between">
      <div className="flex flex-col">
        <h3 className="text-lg font-semibold">{version.versionName}</h3>
        <p className="text-sm text-muted-foreground">
          Створена: {new Date(version.createdAt).toLocaleDateString()}
        </p>
        <p className="text-sm text-muted-foreground">
          Стан: {statusMap[version.status]}
        </p>
      </div>
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="mt-2"
          >
            Деталі
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Деталі: {version.version}</DialogTitle>
          </DialogHeader>
          <div>
            <p className="text-sm text-muted-foreground">
              Створена: {new Date(version.createdAt).toLocaleDateString()}
            </p>
            <p className="text-sm text-muted-foreground mb-2">
              Стан: {statusMap[version.status]}
            </p>
            <Separator />
            <div className="mt-4">
              <Label
                htmlFor="version-file"
                className="block mb-2"
              >
                Файл версії
              </Label>
              <div>
                <div className="flex items-center ">
                  <p className="text-sm text-muted-foreground">
                    {version.file?.originalName || "Файл не завантажено"}
                  </p>
                  <Button
                    variant="link"
                    className="text-sm"
                    disabled={version.status !== "DRAFT"}
                    onClick={() => setIsUpdateFile(!isUpdateFile)}
                  >
                    {isUpdateFile ? "Скасувати" : "Оновити файл"}
                  </Button>
                </div>
                {isUpdateFile && (
                  <form onSubmit={handleFileUpload}>
                    <Input
                      id="version-file"
                      name="version-file"
                      type="file"
                      accept=".msi,.exe,.zip,.tar,.gz,.apk"
                      className="mt-2"
                      placeholder="Upload version file"
                    />
                    <Button className="mt-2">Завантажити</Button>
                  </form>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={handleSendForReview}
            >
              Відправити на розгляд
            </Button>
            <Button
              onClick={handleSetActiveVersion}
              disabled={isSettingActiveVersion}
            >
              <Lock /> Встановити активною
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export const AppSettingsVersions = () => {
  const { appId } = useParams<{ appId: string }>();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  console.log("App ID:", appId);

  const { data: appSettings } = useGetApplicationByIdQuery(Number(appId), {
    skip: !appId,
  });

  const { data: versions, isLoading } = useGetAppVersionsQuery(Number(appId));
  const [createVersionMutation, { isLoading: isCreateVersionLoading }] =
    useCreateVersionMutation();

  const onFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const versionName = formData.get("version-name") as string;

    console.log("Creating version with name:", versionName);

    if (!versionName) {
      alert("Version name is required");
      return;
    }

    try {
      await createVersionMutation({
        appId: Number(appId),
        versionName,
      }).unwrap();
      toast.success("Version created successfully");
      setIsCreateDialogOpen(false);
    } catch {
      toast.error("Failed to create version. Please try again.");
    }
  };

  console.log("Versions data:", versions);

  return (
    <div className="flex flex-col gap-4 p-6">
      <h2 className="text-2xl font-bold">Версії</h2>
      <Dialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
      >
        <DialogTrigger asChild>
          <Button className="w-fit">Створити нову версію</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Створити нову версію</DialogTitle>
          </DialogHeader>
          <form
            className="space-y-4 flex flex-col"
            onSubmit={onFormSubmit}
          >
            <Label htmlFor="version-name">Ім'я версії</Label>
            <Input
              name="version-name"
              id="version-name"
              placeholder="Наприклад, 1.0.0"
            />

            <Button
              className="w-fit self-end"
              type="submit"
              disabled={isCreateVersionLoading}
            >
              {isCreateVersionLoading ? "Створюємо..." : "Створити"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
      <Separator />
      <h3 className="text-lg font-semibold">Активна версія</h3>
      {appSettings?.activeVersion && (
        <VersionCard version={appSettings.activeVersion} />
      )}
      <h3 className="text-lg font-semibold">Історія</h3>
      <ul className="space-y-2">
        {versions?.map((version) => (
          <li key={version.id}>
            <VersionCard version={version} />
          </li>
        ))}
      </ul>
    </div>
  );
};
