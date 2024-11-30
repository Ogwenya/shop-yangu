import Link from "next/link";
import { FileQuestion } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-full space-y-4">
      <FileQuestion className="h-12 w-12 text-muted-foreground" />
      <h2 className="text-2xl font-bold">Page not found</h2>
      <p className="text-muted-foreground">
        The page you are looking for does&apos;nt exist.
      </p>
      <Button asChild>
        <Link href="/">Go back home</Link>
      </Button>
    </div>
  );
}
