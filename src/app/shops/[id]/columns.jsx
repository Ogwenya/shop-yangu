"use client";

import Image from "next/image";
import { DataTableColumnHeader } from "@/components/ui/data-table/column-header";
import ColumnActions from "@/app/products/column-actions";

export const columns = [
  {
    accessorKey: "image",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Image" />
    ),
    cell: ({ row }) => {
      const product = row.original;

      return (
        <Image src={product.image} height={40} width={40} alt={product.id} />
      );
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
    accessorKey: "price",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Price" />
    ),
    cell: ({ row }) => {
      const price = row.original.price;

      const formatted_price = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "KSH",
      }).format(price);

      return formatted_price;
    },
    size: 20,
  },
  {
    accessorKey: "stock_level",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Stock Level" />
    ),

    size: 20,
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const product = row.original;

      return <ColumnActions product={product} shop_id={product.shop_id} />;
    },
    size: 10,
  },
];
