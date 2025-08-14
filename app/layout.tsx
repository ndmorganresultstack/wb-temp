import type { Metadata } from 'next';
import RootLayoutClient from '@/components/rootLayoutClient';
import { initializeAppInsights } from '@/lib/appInsights';

export const metadata: Metadata = {
  title: 'Willowbridge IT Dashboard',
  description: 'Dashboard for managing IT costs',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  initializeAppInsights(); // Safe for server-side
  return (
    <html lang="en">
      <body>
        <RootLayoutClient user={null}>{children}</RootLayoutClient>
      </body>
    </html>
  );
}