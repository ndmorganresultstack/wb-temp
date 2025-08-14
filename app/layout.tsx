import type { Metadata } from "next";
import RootLayoutClient from "@/components/rootLayoutClient"; 
import { getUserInfo, ClientPrincipal } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Willowbridge IT Dashboard",
  description: "",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user= await getUserInfo();
console.log('RootLayout user:', user); // Debug log
  return (
    <html lang="en">
      <body>
      <RootLayoutClient user={user}>
        {children}
      </RootLayoutClient>
      </body>
    </html>
  );
}