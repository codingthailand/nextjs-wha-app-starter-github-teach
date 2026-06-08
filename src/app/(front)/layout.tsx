import { Suspense } from "react";
import type { Metadata } from "next";
import "../globals.css";
import Navbar from "@/components/navbar";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "ระบบ E-Commerce",
  description: "เรียนรู้การเขียน Nex.tjs",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" className="font-sans">
      <body>
        <Toaster richColors position="top-right" />
        <Suspense fallback={<div className="h-16 border-b bg-background" />}>
        <Navbar />
        </Suspense>
        {children}
      </body>
    </html>
  );
}
