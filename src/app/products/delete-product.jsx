"use client";

import { useState } from "react";
import { AlertCircle, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import SubmitButton from "@/components/ui/submit-button";
import revalidate_data from "@/app/actions";

const DeleteProduct = ({ product }) => {
  const [modal_open, set_modal_open] = useState(false);
  const [loading, set_loading] = useState(false);
  const [error, set_error] = useState(null);

  const delete_product = async () => {
    try {
      set_error(null);

      set_loading(true);

      const res = await fetch(`/api/products/${product.id}`, {
        method: "DELETE",
      });

      const result = await res.json();

      set_loading(false);

      if (result.error) {
        set_error(result.message);
      } else {
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
    <AlertDialog open={modal_open} onOpenChange={set_modal_open}>
      <AlertDialogTrigger asChild>
        <Trash2 className="text-destructive cursor-pointer" size={20} />
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm product deletion.</AlertDialogTitle>
          <AlertDialogDescription>
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </AlertDialogDescription>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the
            product <span className="font-bold">{product.name}</span> from the
            database.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>

          <SubmitButton
            variant="destructive"
            loading={loading}
            onClick={delete_product}
          >
            Delete Product
          </SubmitButton>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteProduct;
