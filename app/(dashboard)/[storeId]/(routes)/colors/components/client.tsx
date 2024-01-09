"use client";

import { ApiList } from "@/components/ui/api-list";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import { ColorColumn, columns } from "./columns";

interface ColorsClientProps {
  data: ColorColumn[];
}

export const ColorsClient: React.FC<ColorsClientProps> = ({ data }) => {
  const router = useRouter();
  const params = useParams();
  const env = process.env.NEXT_PUBLIC_ENV;

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Colores (${data.length})`}
          description="Gestiona los colores de tu tienda."
        />
        <Button onClick={() => router.push(`/${params.storeId}/colors/new`)}>
          <Plus className="mr-2 h-4 w-4" />
          Agregar
        </Button>
      </div>
      <Separator />
      <DataTable columns={columns} data={data} searchKey="name" />
      {env !== "production" && (
        <>
          <Heading title="API" description="API llamadas para Colores" />
          <Separator />
          <ApiList entityName="colors" entityIdName="colordId" />
        </>
      )}
    </>
  );
};
