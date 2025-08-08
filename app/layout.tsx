import type { Metadata } from "next";
import RootLayoutClient from "@/components/rootLayoutClient"; 
import { SessionProvider } from "next-auth/react";

export const metadata: Metadata = {
  title: "Willowbridge IT Dashboard",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <SessionProvider>
        <RootLayoutClient>{children}</RootLayoutClient>
      </SessionProvider>
    </html>
  );
}