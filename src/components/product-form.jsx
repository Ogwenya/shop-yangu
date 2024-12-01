"use client";
import { useState } from "react";
import Image from "next/image";
import { AlertCircle, PenBox, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import SubmitButton from "@/components/ui/submit-button";
import revalidate_data from "@/app/actions";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

export default function ProductForm({ product, shop_id, shop_name, shops }) {
  const [name, set_name] = useState(product?.name || "");
  const [description, set_description] = useState(product?.description || "");
  const [price, set_price] = useState(product?.price || "");
  const [stock_level, set_stock_level] = useState(product?.stock_level || "");
  const [shop, set_shop] = useState(shop_id || product?.shop_id || "");
  const [image, set_image] = useState(null);
  const [error, set_error] = useState(null);
  const [loading, set_loading] = useState(false);
  const [modal_open, set_modal_open] = useState(false);

  const submit_form = async () => {
    set_error(null);

    if (!name || !description || !price || !stock_level || !shop) {
      set_error("Provide name, description, price, shop and stock level.");
      return;
    }

    // ensure image is uploaded when creating a new product and optional when editing
    if (!product && !image) {
      set_error("Upload an image.");
      return;
    }

    if (image && !image.type.startsWith("image/")) {
      set_error("Upload a valid image.");

      return;
    }

    try {
      set_loading(true);

      const data = new FormData();
      data.append("name", name);
      data.append("description", description);
      data.append("price", price);
      data.append("stock_level", stock_level);
      data.append("shop_id", shop);

      if (image) {
        data.append("image", image);
      }

      //   set api url
      const api_url = product
        ? `/api/products/${product._id}`
        : "/api/products";

      const res = await fetch(api_url, {
        method: product ? "PATCH" : "POST",
        body: data,
      });

      const result = await res.json();

      set_loading(false);

      if (result.error) {
        set_error(result.message);
      } else {
        if (!product) {
          set_name("");
          set_description("");
          set_price("");
          set_stock_level("");
        }
        set_image(null);
        set_error(null);
        set_modal_open(false);
        revalidate_data("products");
        revalidate_data("shops");
      }
    } catch (error) {
      set_loading(false);
      set_error(error.message);
    }
  };

  return (
    <Dialog open={modal_open} onOpenChange={set_modal_open}>
      <DialogTrigger asChild>
        {product ? (
          <PenBox className="cursor-pointer" size={20} />
        ) : (
          <Button variant="outline" size="sm" className="h-8">
            <Plus className="mr-2 h-4 w-4" />
            Add product
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{product ? "Update" : "Add"} product</DialogTitle>

          {/* show error messages */}
          <DialogDescription>
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </DialogDescription>
        </DialogHeader>
        <div className="grid md:grid-cols-2 gap-4 gap-y-8 py-4">
          <div className="col-span-full grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => set_name(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="price">Price</Label>
            <Input
              id="price"
              type="number"
              value={price}
              onChange={(e) => set_price(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="stock_level">Stock level</Label>
            <Input
              id="stock_level"
              type="number"
              value={stock_level}
              onChange={(e) => set_stock_level(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="shop">Shop</Label>
            {shop_id ? (
              // auto select shop when crating products from specific shop url
              <Select id="shop" value={shop_id} disabled>
                <SelectTrigger>
                  <SelectValue>{shop_name}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={shop_id}>{shop_name}</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              // show shop select when creating a new product from /products url
              <Select
                id="shop"
                value={shop}
                onValueChange={(value) => set_shop(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a shop" />
                </SelectTrigger>
                <SelectContent>
                  {shops.map((shop) => (
                    <SelectItem key={shop._id} value={shop._id}>
                      {shop.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="image">image</Label>

            <Input
              id="image"
              type="file"
              onChange={(e) => set_image(e.target.files[0])}
              accept="image/*"
              disabled={loading}
              required
            />
          </div>

          <div className="col-span-full grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={description}
              onChange={(e) => set_description(e.target.value)}
              required
            />
          </div>

          {/* show the current product image during editing */}
          {product && (
            <div className="col-span-full">
              <Image src={product?.image} alt="image" height={50} width={50} />
            </div>
          )}
        </div>
        <DialogFooter>
          <SubmitButton
            loading={loading}
            onClick={submit_form}
            className="w-full"
          >
            {product ? "Update" : "Add"}
          </SubmitButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
