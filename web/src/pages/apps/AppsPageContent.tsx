import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectValue,
  SelectContent,
  SelectTrigger,
  SelectItem,
} from "@/components/ui/select";
import {
  useCreateApplicationMutation,
  useGetDeveloperApplicationsQuery,
} from "@/lib/api/api";
import { mockApplications } from "@/lib/mocks";
import type { Application } from "@/types/application/application.type";

import { DownloadIcon, MoreHorizontal, PlusIcon } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";

const AppCard = ({
  app,
  onClick,
}: {
  app: Application;
  onClick: () => void;
}) => {
  return (
    <div
      className="flex border rounded-lg p-2 gap-4 align-center  hover:bg-gray-50 transition-colors cursor-pointer"
      onClick={onClick}
    >
      <img
        src={app.iconMedia?.mediaUrl || "https://via.placeholder.com/32"}
        alt={app.title}
        className="w-8 h-8 object-cover "
      />
      <div className="flex flex-col">
        <span className="font-semibold">{app.title}</span>
      </div>
      <div className="ml-auto flex items-center">
        <DownloadIcon className="h-4 w-4 text-gray-500" />
        <span className="ml-1 text-sm text-gray-500">{app.downloads || 0}</span>
      </div>
    </div>
  );
};

export const AppsPageContent = () => {
  const navigate = useNavigate();
  const [createApplication, result] = useCreateApplicationMutation();

  const [createAppData, setCreateAppData] = useState({
    title: "",
    type: "WEB" as "web" | "desktop",
  });

  const { data: developerApps, isLoading: isLoadingApps } =
    useGetDeveloperApplicationsQuery(undefined, {
      refetchOnMountOrArgChange: true,
    });

  const onTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCreateAppData({
      ...createAppData,
      title: e.target.value,
    });
  };

  const onTypeChange = (value: "web" | "desktop") => {
    setCreateAppData({
      ...createAppData,
      type: value,
    });
  };

  const handleCreateApp = async () => {
    try {
      const result = await createApplication({
        title: createAppData.title,
        type: createAppData.type,
      }).unwrap();

      if (result) {
        navigate(`/dev/apps/${result.id}`);
      }

      console.log("App created successfully");
    } catch (error) {
      console.error("Failed to create app:", error);
    }
  };

  const handleRowClick = (row: (typeof appsMock)[0]) => {
    navigate(`/dev/apps/${row.id}`);
  };

  return (
    <div className="flex flex-col w-full p-6 items-center">
      <div className="flex flex-col w-full max-w-6xl gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Ваші застосунки</h1>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <PlusIcon className="h-4 w-4" />
                <span>Створити новий застосунок</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Створити новий застосунок</DialogTitle>
                <DialogDescription>
                  Введіть інформацію про застосунок. Ви зможете додати більше
                  деталей пізніше.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-2">
                <Label htmlFor="app-type">Назва</Label>
                <Input
                  id="app-name"
                  placeholder="Введіть назву застосунку"
                  value={createAppData.title}
                  onChange={onTitleChange}
                />
                <Label
                  htmlFor="app-type"
                  className="mt-4"
                >
                  Вид застосунку
                </Label>
                <Select
                  value={createAppData.type}
                  onValueChange={onTypeChange}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Вид застосунку" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="WEB">Вебзастосунок</SelectItem>
                    <SelectItem value="DESKTOP">
                      Завантажуваний застосунок
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <DialogFooter>
                <Button onClick={handleCreateApp}>
                  <span>Створити</span>
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        {developerApps?.length === 0 && !isLoadingApps ? (
          <div className="text-center text-gray-500">You have no apps yet.</div>
        ) : (
          developerApps?.map((app) => (
            <AppCard
              key={app.id}
              app={app}
              onClick={() => handleRowClick(app)}
            />
          ))
        )}
      </div>
    </div>
  );
};
