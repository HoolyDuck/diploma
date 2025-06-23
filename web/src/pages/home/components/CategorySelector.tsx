import { Badge } from "@/components/ui/badge";
import { useGetCategoriesQuery } from "@/lib/api/api";

type Props = {
  selectedCategory?: number | null;
  onCategoryClick: (categoryId: number) => void;
};

export const CategorySelector = ({
  onCategoryClick,
  selectedCategory,
}: Props) => {
  const { data: categories } = useGetCategoriesQuery(undefined);

  return (
    <div className="col-span-1 md:col-span-1 flex flex-col gap-4">
      <h1 className="text-2xl font-bold ">Категорії</h1>
      <div className="flex flex-wrap gap-2">
        {categories?.map((category) => (
          <Badge
            key={category.id}
            className="cursor-pointer"
            variant={selectedCategory === category.id ? "default" : "outline"}
            onClick={() => onCategoryClick(category.id)}
          >
            {category.categoryName}
          </Badge>
        ))}
      </div>
    </div>
  );
};
