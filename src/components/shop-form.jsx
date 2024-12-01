"use client";

import { useState } from "react";
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
import Image from "next/image";

export default function ShopForm({ shop }) {
  const [name, set_name] = useState(shop?.name || "");
  const [description, set_description] = useState(shop?.description || "");
  const [logo, set_logo] = useState(null);
  const [error, set_error] = useState(null);
  const [loading, set_loading] = useState(false);
  const [modal_open, set_modal_open] = useState(false);

  const submit_form = async () => {
    set_error(null);

    if (!name || !description) {
      set_error("Provide name and description.");
      return;
    }

    if (logo && !logo.type.startsWith("image/")) {
      set_error("Upload a valid image.");

      return;
    }

    try {
      set_loading(true);

      const data = new FormData();
      data.append("name", name);
      data.append("description", description);

      if (logo) {
        data.append("logo", logo);
      }

      //   set api url
      const api_url = shop ? `/api/shops/${shop._id}` : "/api/shops";

      const res = await fetch(api_url, {
        method: shop ? "PATCH" : "POST",
        body: data,
      });

      const result = await res.json();

      set_loading(false);

      if (result.error) {
        set_error(result.message);
      } else {
        if (!shop) {
          set_name("");
          set_description("");
        }
        set_logo(null);
        set_error(null);
        set_modal_open(false);
        revalidate_data("shops");
        revalidate_data(`shop-${shop._id}`);
      }
    } catch (error) {
      set_loading(false);
      set_error(error.message);
    }
  };

  return (
    <Dialog open={modal_open} onOpenChange={set_modal_open}>
      <DialogTrigger asChild>
        {shop ? (
          <PenBox className="cursor-pointer" size={20} />
        ) : (
          <Button variant="outline" size="sm" className="h-8">
            <Plus className="mr-2 h-4 w-4" />
            Add Shop
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{shop ? "Update" : "Add"} Shop</DialogTitle>

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
        <div className="grid gap-4 gap-y-8 py-4">
          <div className="grid gap-2">
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

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={description}
              onChange={(e) => set_description(e.target.value)}
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="image">Logo</Label>

            <div>
              <Input
                id="image"
                type="file"
                onChange={(e) => set_logo(e.target.files[0])}
                accept="image/*"
                disabled={loading}
              />

              {!shop && (
                <span className="text-sm text-gray-500">
                  Leave blank to keep the default logo
                </span>
              )}
            </div>

            {/* show the current shop image during editing */}
            {shop && (
              <Image src={shop?.logo} alt="image" height={50} width={50} />
            )}
          </div>
        </div>
        <DialogFooter>
          <SubmitButton
            loading={loading}
            onClick={submit_form}
            className="w-full"
          >
            {shop ? "Update" : "Add"}
          </SubmitButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
