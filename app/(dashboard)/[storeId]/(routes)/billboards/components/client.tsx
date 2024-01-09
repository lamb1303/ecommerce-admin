"use client";

import { ApiList } from "@/components/ui/api-list";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import { BillboardColumn, columns } from "./columns";

interface BillboardClientProps {
  data: BillboardColumn[];
}

export const BillboardClient: React.FC<BillboardClientProps> = ({ data }) => {
  const router = useRouter();
  const params = useParams();
  const env = process.env.NEXT_PUBLIC_ENV;

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Cartelera (${data.length})`}
          description="Gestiona publicidad para tu tienda."
        />
        <Button
          onClick={() => router.push(`/${params.storeId}/billboards/new`)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Agregar
        </Button>
      </div>
      <Separator />
      <DataTable columns={columns} data={data} searchKey="label" />
      {env !== "production" && (
        <>
          <Heading title="API" description="API llamadas para Cartelera" />
          <Separator />
          <ApiList entityName="billboards" entityIdName="billboardId" />
        </>
      )}
    </>
  );
};
