"use client";

import { ApiList } from "@/components/ui/api-list";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { CategoryColumn, columns } from "./columns";
import { es } from "date-fns/locale";
import { format, parseISO } from "date-fns";
import useSWR from "swr";
import { Progress } from "@/components/ui/progress";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export const CategoryClient = () => {
  const router = useRouter();
  const env = process.env.NEXT_PUBLIC_ENV;

  const { data } = useSWR("/api/categories", fetcher);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!data) {
      setProgress(10);

      const incrementProgress = () => {
        setProgress((prevProgress) => {
          // Increment progress more slowly as it approaches 100%
          const increment = prevProgress < 50 ? 10 : prevProgress < 80 ? 5 : 2;
          const nextProgress = prevProgress + increment;
          // Do not exceed 99% until data is loaded
          return nextProgress < 99 ? nextProgress : 99;
        });
      };

      // Start an interval to increment progress
      const intervalId = setInterval(incrementProgress, 100);

      // Clean up interval on component unmount or when data is loaded
      return () => clearInterval(intervalId);
    } else {
      // Immediately set progress to 100% when data is loaded
      setProgress(100);
    }
  }, [data]);

  if (!data)
    return (
      <div className="flex items-center justify-center h-screen">
        <Progress
          className="flex items-center justify-between"
          value={progress}
        />
      </div>
    );

  const formattedNews: CategoryColumn[] = data.map((item: any) => ({
    id: item.id,
    name: item.name,
    description: item.description,
    created_at: format(parseISO(item.created_at), "MMMM do, yyyy", {
      locale: es,
    }),
  }));

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Categorías (${data.length})`}
          description="Gestiona categorías para tus noticias."
        />
        <Button onClick={() => router.push(`/categories/new`)}>
          <Plus className="mr-2 h-4 w-4" />
          Agregar
        </Button>
      </div>
      <Separator />
      <DataTable columns={columns} data={formattedNews} searchKey="name" />
      {env !== "production" && (
        <>
          <Heading title="API" description="API llamadas para categorías" />
          <Separator />
          <ApiList entityName="categories" entityIdName="categoryId" />
        </>
      )}
    </>
  );
};
