import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { MultiSelect } from "@/components/ui/multi-select";

import { useState } from "react";
import {
  useGetApplicationByIdQuery,
  useGetCategoriesQuery,
  useUpdateApplicationInfoMutation,
} from "@/lib/api/api";
import { toast } from "sonner";
import { useParams } from "react-router";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
});

type Props = {
  title: string;
  description?: string;
};

export const AppSettingsTextForm: React.FC<Props> = (props) => {
  const { appId } = useParams<{ appId: string }>();

  const { data: appSettings } = useGetApplicationByIdQuery(Number(appId), {
    skip: !appId,
  });

  const { data: categories } = useGetCategoriesQuery(undefined);

  const categoryList =
    categories?.map((category) => ({
      label: category.categoryName,
      value: category.id.toString(),
    })) || [];

  const appCategories = (appSettings?.AppCategory || []).map((category) =>
    category.categoryId.toString()
  );

  console.log("App categories:", appCategories);

  const [selectedCategories, setSelectedCategorires] =
    useState<string[]>(appCategories);
  const [updateApplicationInfoMutation, { isLoading: isUpdating }] =
    useUpdateApplicationInfoMutation();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: props.title || "",
      description: props.description || "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const categories = selectedCategories.map((id) => ({
      id: Number(id),
    }));

    updateApplicationInfoMutation({
      id: Number(appId),
      updateApplicationDto: {
        title: values.title,
        description: values.description,
        categories,
      },
    })
      .unwrap()
      .then(() => {
        toast.success("Інформацію про застосунок оновлено успішно!");
      })
      .catch(() => {
        toast.error(
          `Не вдалося оновити інформацію про застосунок. Cпробуйте ще раз пізніше.`
        );
      });
  }
  return (
    <Form {...form}>
      <h1 className="text-2xl font-bold">Налаштування</h1>

      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Назва</FormLabel>

              <FormControl>
                <Input
                  placeholder="Введіть назву застосунку"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Опис</FormLabel>

              <FormControl>
                <Textarea
                  placeholder="Введіть опис застосунку"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          name="categories"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Категорії</FormLabel>

              <FormControl>
                <MultiSelect
                  defaultValue={appCategories}
                  options={categoryList}
                  onValueChange={setSelectedCategorires}
                  value={selectedCategories}
                  placeholder="Оберіть категорії"
                  maxCount={3}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormDescription>
          Введіть інформацію про застосунок, яка буде відображатися
          користувачам.
        </FormDescription>
        <Button type="submit">
          {isUpdating ? "Зберігаємо..." : "Зберегти"}
        </Button>
      </form>
    </Form>
  );
};
