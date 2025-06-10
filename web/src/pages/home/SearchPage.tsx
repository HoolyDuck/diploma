import { Header } from "@/components/header";
import { Badge } from "@/components/ui/badge";
import { useGetApplicationsQuery } from "@/lib/api/api";
import { useSearchParams } from "react-router";
import { AppCard } from "./HomePage";
import { mockApplications, mockCategories } from "@/lib/mocks";
import { number } from "zod";
import { useState } from "react";

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

export const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  const query = searchParams.get("query") || "";
  const category = searchParams.get("category");

  const onFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const searchQuery = (
      e.currentTarget.elements.namedItem("search") as HTMLInputElement
    ).value;
    setSearchParams({ query: searchQuery });
  };

  const { data: applications, isLoading } = useGetApplicationsQuery({
    search: query,
    categoryId: category ? Number(category) : undefined,
  });

  return (
    <>
      <Header onFormSubmit={onFormSubmit} />
      <div className="flex flex-col items-center min-h-svh w-full p-6 gap-6">
        <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="col-span-1 md:col-span-3 flex flex-col gap-6">
            <div>
              <h1 className="text-2xl font-bold mb-4">
                Результати пошуку за запитом:{" "}
                <span className="text-blue-500">{query}</span>
              </h1>
              <div className="flex flex-col gap-4">
                {mockApplications.slice(0, 1)?.map((app) => (
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
                  variant={
                    selectedCategory === category.id ? "default" : "outline"
                  }
                  onClick={() => {
                    setSelectedCategory(category.id);
                  }}
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
