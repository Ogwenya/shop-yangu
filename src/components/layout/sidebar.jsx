"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { ShoppingBag, Package, LayoutDashboard } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

export function Sidebar({ screen }) {
  const pathname = usePathname();

  const sidebar_items = [
    { name: "Dashboard", url: "/", icon: LayoutDashboard },
    { name: "Products", url: "/products", icon: Package },
    { name: "Shops", url: "/shops", icon: ShoppingBag },
  ];

  return (
    <ScrollArea
      className={`${
        screen === "large" && "hidden lg:block border-r"
      } h-screen overflow-y-scroll`}
    >
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            ShopYangu
          </Link>
        </div>
        <div className="flex-1">
          <nav className="grid gap-1 items-start px-2 text-sm font-medium lg:px-4">
            {sidebar_items.map((item) => (
              <Link
                href={item.url}
                className={`rounded-lg hover:bg-primary hover:text-primary-foreground ${
                  pathname === item.url && "bg-primary text-primary-foreground"
                }  px-3 py-2 transition-all`}
                key={item.name}
              >
                <span className="flex items-center gap-3">
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </span>
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </ScrollArea>
  );
}
