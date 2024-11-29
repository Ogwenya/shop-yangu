"use client";

import Image from "next/image";
import Link from "next/link";
import { Eye } from "lucide-react";
import { DataTableColumnHeader } from "@/components/ui/data-table/column-header";
import ProductForm from "@/components/product-form";
import { useEffect, useState } from "react";
import DeleteProduct from "./delete-product";

export const columns = [
  {
    accessorKey: "image",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Image" />
    ),
    cell: ({ row }) => {
      const product = row.original;

      return (
        <Image src={product.image} alt={product.id} height={40} width={40} />
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
    accessorKey: "shop_name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Shop" />
    ),

    size: 20,
  },

  {
    id: "actions",
    cell: ({ row }) => {
      const product = row.original;
      const [shops, setShops] = useState([]);

      useEffect(() => {
        async function fetchShops() {
          const response = await fetch(`/api/shops`);
          const data = await response.json();
          setShops(data);
        }
        fetchShops();
      }, []);

      return (
        <div className="flex items-center gap-3">
          <ProductForm product={product} shops={shops} />

          <DeleteProduct product={product} />
        </div>
      );
    },
    size: 10,
  },
];
