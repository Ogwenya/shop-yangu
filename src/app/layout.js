import localFont from "next/font/local";
import { getServerSession } from "next-auth";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import AppLayout from "@/components/layout/layout";
import { authOptions } from "./api/auth/[...nextauth]/route";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const revalidate = 600;

export const metadata = {
  title: "ShopYangu Admin",
  description: "Admin panel for managing shops and products on ShopYangu",
};

async function getData() {
  const server_session = await getServerSession(authOptions);

  if (server_session?.access_token) {
    const { user } = server_session;

    return { user };
  }
}

export default async function RootLayout({ children }) {
  const data = await getData();
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AppLayout user={data?.user}>{children}</AppLayout>

        <Toaster />
      </body>
    </html>
  );
}
