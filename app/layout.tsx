import type { Metadata } from 'next';
import RootLayoutClient from '@/components/rootLayoutClient';
import { initializeAppInsights } from '@/lib/appInsights'; 
import './globals.css'; 
import { Roboto_Condensed, Roboto_Mono, Roboto_Serif } from 'next/font/google'; 

 

const robotoMono = Roboto_Mono({
  variable: '--font-roboto-mono',
  subsets: ['latin'],
});

const robotoSerif = Roboto_Serif({
  variable: '--font-roboto-serif',
  subsets: ['latin'],
});

const robotoCondensed = Roboto_Condensed({
  subsets: ['latin'],
  weight: ['300', '400', '700'], // Include light, regular, and bold weights
  variable: '--font-roboto-condensed', // Define CSS variable
});

export const metadata: Metadata = {
  title: 'Willowbridge',
  description: '',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) { 
 

  initializeAppInsights(); // Safe for server-side
  return (
    <html lang="en">
      <body className={`${robotoCondensed.className}`}>
        
        <RootLayoutClient user={null}>{children}</RootLayoutClient>
         
      </body>
    </html>
  );
}