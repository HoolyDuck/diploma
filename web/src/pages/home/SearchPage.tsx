import { Header } from "@/components/header";
import { Badge } from "@/components/ui/badge";
import { useGetApplicationsQuery } from "@/lib/api/api";
import { useSearchParams } from "react-router";
import { AppCard } from "./HomePage";
import { mockApplications, mockCategories } from "@/lib/mocks";
import { number } from "zod";
import { useState } from "react";
import { CategorySelector } from "./components/CategorySelector";

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

  const query = searchParams.get("query") || "";
  const category = searchParams.get("category");

  const [selectedCategory, setSelectedCategory] = useState<number | null>(
    category ? Number(category) : null
  );

  const onFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const searchQuery = (
      e.currentTarget.elements.namedItem("search") as HTMLInputElement
    ).value;
    setSearchParams({ query: searchQuery });
  };

  const { data: applications, isLoading } = useGetApplicationsQuery({
    search: query || undefined,
    categoryId: category ? Number(category) : undefined,
  });

  const onCategoryClick = (categoryId: number) => {
    if (selectedCategory === categoryId) {
      setSelectedCategory(null);
      setSearchParams({ query });
      return;
    }
    setSelectedCategory(categoryId);
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      params.set("category", String(categoryId));
      return params;
    });
  };

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
                {applications?.map((app) => (
                  <AppCard
                    key={app.id}
                    app={app}
                  />
                ))}
              </div>
            </div>
          </div>
          <CategorySelector
            selectedCategory={selectedCategory}
            onCategoryClick={onCategoryClick}
          />
        </div>
      </div>
    </>
  );
};
