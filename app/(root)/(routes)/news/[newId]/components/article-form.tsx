"use client";

import * as z from "zod";
import axios from "axios";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { Calendar as CalendarIcon } from "lucide-react";
import { useRouter } from "next/navigation";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Heading } from "@/components/ui/heading";
import ImageUpload from "@/components/ui/image-upload";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { es } from "date-fns/locale";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface NewsFormProps {
  initialData: any;
  categories: any;
}

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  author_id: z.string().optional(),
  category_id: z.string().min(1, "Category ID is required").optional(),
  publication_date: z
    .string()
    .min(1, "Publication date is required")
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Invalid date format",
    }),
  images: z.object({ url: z.string() }).array(),
  excerpt: z.string().optional(),
  is_archived: z.boolean().default(false),
  front_page: z.string().optional(),
});

type ArticleFormValues = z.infer<typeof formSchema>;

export const ArticleForm: React.FC<NewsFormProps> = ({
  initialData,
  categories,
}) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const title = initialData ? "Editar Noticia" : "Crear Noticia";
  const description = initialData
    ? "Edita tu noticia."
    : "Agrega una nueva noticia";
  const [loading, setLoading] = useState(false);

  const parsedImages =
    initialData?.images?.map((image: string) => JSON.parse(image)) || [];

  console.log({ categories });

  const form = useForm<ArticleFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialData?.title || "",
      content: initialData?.content || "",
      author_id: initialData?.author_id || "",
      category_id: initialData?.category_id || "",
      publication_date: initialData?.publication_date || "",
      images: parsedImages,
      excerpt: initialData?.excerpt || "",
      is_archived: initialData?.is_archived || false,
      front_page: initialData?.front_page || "",
    },
  });

  useEffect(() => {
    form.reset({
      title: initialData?.title || "",
      content: initialData?.content || "",
      author_id: initialData?.author_id || "",
      category_id: String(initialData?.category_id) || "",
      publication_date: initialData?.publication_date || "",
      images: parsedImages,
      excerpt: initialData?.excerpt || "",
      is_archived: initialData?.is_archived || false,
      front_page: initialData?.front_page || "",
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialData]);

  const onSubmit = async (data: ArticleFormValues) => {
    try {
      setLoading(true);
      if (initialData) {
        await axios.patch(`/api/articles/${initialData.id}`, data);
        toast.success("Noticia Actualizada.");
      } else {
        await axios.post(`/api/articles`, data);
        toast.success("Noticia Creada.");
      }
      router.refresh();
      router.push(`/news`);
    } catch (error: any) {
      toast.error("Algo salio mal.");
    } finally {
      setLoading(false);
    }
  };

  // Watch the publication_date field to update the local state when it changes
  const publicationDate = form.watch("publication_date");

  // Local state to manage the selected date for the Calendar
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();

  // Update local state when the form field changes
  useEffect(() => {
    if (publicationDate) {
      setSelectedDate(new Date(publicationDate));
    }
  }, [publicationDate]);

  const handleDateChange = (date: Date | null) => {
    if (date) {
      form.setValue("publication_date", date.toISOString());
      setSelectedDate(date);
    }
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          <div className="flex items-center justify-between">
            <Heading title={title} description={description} />
            <Button disabled={loading} className="ml-auto" type="submit">
              {initialData ? "Actualizar" : "Crear"}
            </Button>
          </div>
          <Separator />
          <div className="md:grid md:grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Título Noticia"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoría</FormLabel>
                  <Select
                    disabled={loading}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          defaultValue={field.value}
                          placeholder="Selecciona una categoría"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category: any) => (
                        <SelectItem key={category.id} value={String(category.id)}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="front_page"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Portada</FormLabel>
                <FormControl>
                  <ImageUpload
                    value={field.value ? [field.value] : []}
                    disabled={loading}
                    onChange={(url) => field.onChange(url)}
                    onRemove={() => field.onChange("")}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="images"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fotos</FormLabel>
                <FormControl>
                  <ImageUpload
                    lablel="Subir Imágenes"
                    value={field.value.map((image) => image.url)}
                    disabled={loading}
                    onChange={(url) =>
                      field.onChange([...field.value, { url }])
                    }
                    onRemove={(url) =>
                      field.onChange([
                        ...field.value.filter((current) => current.url !== url),
                      ])
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="publication_date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Dia de Publicación</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[240px] pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(new Date(field.value), "MMMM do, yyyy", {
                            locale: es,
                          })
                        ) : (
                          <span>Selecciona una fecha</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={selectedDate || new Date()}
                      onSelect={handleDateChange}
                      required
                    />
                  </PopoverContent>
                </Popover>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contenido</FormLabel>
                <FormControl>
                  <textarea
                    className="w-full p-2 border rounded"
                    disabled={loading}
                    placeholder="Contenido de la noticia"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="excerpt"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Extracto</FormLabel>
                <FormControl>
                  <Input
                    disabled={loading}
                    placeholder="Extracto de la noticia"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="is_archived"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Archivada</FormLabel>
                </div>
                <FormDescription>
                  Esta noticia no aparecera en tu página.
                </FormDescription>
              </FormItem>
            )}
          />
        </form>
      </Form>
    </>
  );
};
