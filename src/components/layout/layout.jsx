"use client";

import { SessionProvider } from "next-auth/react";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";

export default function AppLayout({ user, children }) {
  return (
    <SessionProvider>
      <div className="flex h-screen bg-gray-100">
        <div className={user && "lg:w-[280px]"}>
          {user && <Sidebar screen="large" />}
        </div>
        <div className="flex-1 flex flex-col overflow-hidden">
          {user && <Header />}
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
            {children}
          </main>
        </div>
      </div>
    </SessionProvider>
  );
}
