"use client";

import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Error({ error, reset }) {
  return (
    <div className="flex flex-col items-center justify-center h-full space-y-4">
      <AlertCircle className="h-12 w-12 text-destructive" />
      <h2 className="text-2xl font-bold">Something went wrong!</h2>

      <p className="mt-2">{error.message}</p>
      <Button onClick={() => reset()}>Try again</Button>
    </div>
  );
}
