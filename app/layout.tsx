import "./globals.css";

import type { Metadata } from "next";
import { initializeAppInsights } from "@/lib/appInsights";
import { Roboto_Condensed, Roboto_Mono, Roboto_Serif } from "next/font/google";
import { SetSession } from "@/hooks/useSession";
import { auth } from "@/lib/next-auth";
import { Header } from "@/components/Layout/Header";
import { Sidebar } from "@/components/Layout/Sidebar";

const robotoMono = Roboto_Mono({
	variable: "--font-roboto-mono",
	subsets: ["latin"],
});

const robotoSerif = Roboto_Serif({
	variable: "--font-roboto-serif",
	subsets: ["latin"],
});

const robotoCondensed = Roboto_Condensed({
	subsets: ["latin"],
	weight: ["300", "400", "700"], // Include light, regular, and bold weights
	variable: "--font-roboto-condensed", // Define CSS variable
});

export const metadata: Metadata = {
	title: "Willowbridge",
	description: "",
};

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const session = await auth();
	initializeAppInsights(); // Safe for server-side
	return (
		<html lang="en">
			<body
				className={`${robotoCondensed.variable} ${robotoMono.variable} ${robotoSerif.variable} antialiased`}
			>
				<SetSession session={session} />
				<Header />
				<div className="flex">
					<Sidebar />
					{children}
				</div>
			</body>
		</html>
	);
}
