import type { Metadata } from "next";
import RootLayoutClient from "@/components/rootLayoutClient";

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
      <RootLayoutClient>{children}</RootLayoutClient>
    </html>
  );
}