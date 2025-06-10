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
import { mockCategories } from "@/lib/mocks";
import { useState } from "react";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
});

type Props = {
  title: string;
  description?: string;
};

const categoryList = mockCategories.map((category) => {
  return {
    label: category.name,
    value: category.id.toString(),
  };
});

export const AppSettingsTextForm: React.FC<Props> = (props) => {
  const [selectedCategories, setSelectedCategorires] = useState<string[]>([
    "1", // Example category ID
    "2", // Example category ID
  ]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: props.title || "",
      description: props.description || "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
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
        <Button type="submit">Зберегти</Button>
      </form>
    </Form>
  );
};
