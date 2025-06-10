import { Header } from "@/components/header";
import { Badge } from "@/components/ui/badge";
import { useGetApplicationsQuery } from "@/lib/api/api";
import { mockApplications, mockApplications2, mockCategories } from "@/lib/mocks";
import type { Application } from "@/types/application/application.type";
import { DownloadIcon } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { useDebouncedCallback } from "use-debounce";

const mockIcon =
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSw-HhSyTMAbUk43GMiLfmGqSJm-Gc7qK9oPQ&s";

const latestAppsMock = [
  {
    id: "1",
    name: "App One",
    description: "This is a description for App One.",
    icon: mockIcon,
    downloads: 1200,
    categories: ["Productivity", "Utilities"],
  },
  {
    id: "2",
    name: "App Two",
    description: "This is a description for App Two.",
    icon: mockIcon,
    downloads: 800,
    categories: ["Social", "Entertainment"],
  },
  {
    id: "3",
    name: "App Three",
    description: "This is a description for App Three.",
    icon: mockIcon,
    downloads: 1500,
    categories: ["Games", "Entertainment"],
  },
];

const categoriesMock = [
  {
    id: "1",
    name: "Productivity",
  },
  {
    id: "2",
    name: "Social",
  },
  {
    id: "3",
    name: "Games",
  },
];

export const AppCard = ({ app }: { app: Application }) => {
  return (
    <div className="flex border rounded-lg p-2  gap-4 align-center h-24 hover:bg-gray-50 transition-colors">
      <img
        src={app.iconMedia?.mediaUrl || mockIcon}
        alt={`${app.title} icon`}
        className="w-16 h-16 object-cover rounded"
        height="32"
        width="32"
      />
      <div className="flex flex-col">
        <h2 className="text-md font-semibold">{app.title}</h2>
        <p className="text-sm text-gray-600">{app.description}</p>
        <div className="flex items-center gap-2 mt-1">
          {app.categories?.map((category, index) => (
            <Badge
              key={index}
              className="mt-1"
              variant="outline"
            >
              {category.name}
            </Badge>
          ))}
        </div>
      </div>
      <div className="flex items-center ml-auto h-min pr-2">
        <DownloadIcon className="!size-4 text-gray-500" />
        <span className="ml-2 text-sm text-gray-600">{app.downloads || 0}</span>
      </div>
    </div>
  );
};

export const HomePage = () => {
  const [selectedCategory, setSelectedCategory] = useState<number | undefined>(
    undefined
  );

  const navigate = useNavigate();

  const onFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const searchQuery = formData.get("search") as string;

    if (searchQuery) {
      // Redirect to search results page with the query
      navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
    }
  };

  const { data: applications, isLoading } = useGetApplicationsQuery({});

  console.log(applications);

  return (
    <>
      <Header onFormSubmit={onFormSubmit} />
      <div className="flex flex-col items-center min-h-svh w-full p-6 gap-6">
        <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="col-span-1 md:col-span-3 flex flex-col gap-6">
            <div>
              <h1 className="text-2xl font-bold">Вітаємо!</h1>
              <p className="mb-4">
                Перегляньте найновіші застосунки!
              </p>
              <div className="flex flex-col gap-4">
                {mockApplications?.map((app) => (
                  <AppCard
                    key={app.id}
                    app={app}
                  />
                ))}
              </div>
            </div>

            <div className="w-full">
              <h1 className="text-2xl font-bold mb-4">Популярні</h1>

              <div className="flex flex-col gap-4">
                {mockApplications2?.map((app) => (
                  <AppCard
                    key={app.id}
                    app={app}
                  />
                ))}
              </div>
            </div>
          </div>
          <div className="col-span-1 md:col-span-1 flex flex-col gap-4">
            <h1 className="text-2xl font-bold ">Категорії</h1>
            <div className="flex flex-wrap gap-2">
              {mockCategories.map((category) => (
                <Badge
                  key={category.id}
                  className="cursor-pointer"
                  variant="outline"
                >
                  {category.name}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
