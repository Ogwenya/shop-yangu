"use client";

import Image from "next/image";
import Link from "next/link";
import { Eye } from "lucide-react";
import { DataTableColumnHeader } from "@/components/ui/data-table/column-header";
import ShopForm from "@/components/shop-form";
import DeleteShop from "./delete-shop";

export const columns = [
  {
    accessorKey: "logo",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Logo" />
    ),
    cell: ({ row }) => {
      const shop = row.original;

      return <Image src={shop.logo} alt={shop.id} height={40} width={40} />;
    },
    size: 30,
  },

  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
  },
  {
    accessorKey: "description",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Description" />
    ),
    cell: ({ row }) => {
      const description = row.original.description;

      return <span className="truncate">{description}</span>;
    },
  },
  {
    accessorKey: "products_count",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Products Count" />
    ),

    size: 20,
  },

  {
    id: "actions",
    cell: ({ row }) => {
      const shop = row.original;

      return (
        <div className="flex items-center gap-3">
          <Link href={`/shops/${shop.id}`} className="h-fit">
            <Eye size={20} />
          </Link>
          <ShopForm shop={shop} />

          <DeleteShop shop={shop} />
        </div>
      );
    },
    size: 10,
  },
];
