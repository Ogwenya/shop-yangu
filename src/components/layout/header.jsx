import { LogOut, Menu } from "lucide-react";
import { signOut } from "next-auth/react";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Sidebar } from "./sidebar";

export function Header() {
  return (
    <header className="flex-none flex items-center justify-between lg:justify-end h-14 lg:h-[60px] px-4 lg:px-6 border-b">
      {/* small screen sidebar */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 lg:hidden">
            <Menu size={20} />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col">
          <Sidebar screen="small" />
        </SheetContent>
      </Sheet>

      <LogOut
        size={20}
        className="cursor-pointer"
        onClick={() => signOut({ callbackUrl: "/" })}
      />
    </header>
  );
}
