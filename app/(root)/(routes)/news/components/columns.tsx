"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";
import { CheckCircle, XCircle } from "lucide-react";

export type Article = {
  id: string;
  title: string;
  created_at: string;
  is_archived: boolean;
};
export const columns: ColumnDef<Article>[] = [
  {
    accessorKey: "title",
    header: "Título",
  },
  {
    accessorKey: "created_at",
    header: "Creado",
  },
  {
    accessorKey: "is_archived",
    header: "Activa",
    cell: ({ row }) => (
      <div className="flex items-center">
        {row.original.is_archived ? (
          <XCircle className="text-red-500 mr-2" />
        ) : (
          <CheckCircle className="text-green-500 mr-2" />
        )}
      </div>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
