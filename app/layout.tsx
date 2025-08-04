import type { Metadata } from "next";
import { Roboto_Condensed, Roboto_Mono, Roboto_Serif } from "next/font/google";
import "./globals.css";
import { UserCircleIcon } from "@heroicons/react/24/outline"; // For profile icon

const robotoCondensed = Roboto_Condensed({
  variable: "--font-roboto-condensed",
  subsets: ["latin"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
});

const robotoSerif = Roboto_Serif({
  variable: "--font-roboto-serif",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Wollowbridge IT Dashboard",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const menuItems = [
    { name: "Employee Roster", href: "/employee" },
    { name: "Internal Labor Cost", href: "/internal-labor" },
    { name: "External Labor Cost", href: "/external-labor" },
    { name: "Software Costs", href: "/software-costs" },
  ];

  const handleLogout = () => {
    // Implement logout logic here (e.g., clear session, redirect to login)
    console.log("Logout clicked");
    // Example: window.location.href = '/login';
  };

  const handlePreferences = () => {
    // Implement user preferences logic here (e.g., open modal or navigate to settings)
    console.log("Preferences clicked");
    // Example: window.location.href = '/settings';
  };

  return (
    <html lang="en">
      <body
        className={`${robotoCondensed.variable} ${robotoMono.variable} ${robotoSerif.variable} antialiased flex min-h-screen`}
      >
        {/* Sidebar Menu */}
        <div className="w-64 bg-gray-800 text-white p-4 h-screen fixed">
          <div className="mb-8">
            <h1 className="text-2xl font-bold">Wollowbridge IT</h1>
          </div>
          <nav className="space-y-2">
            {menuItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="block py-2 px-4 rounded hover:bg-gray-700"
              >
                {item.name}
              </a>
            ))}
          </nav>
          {/* Profile Dropdown */}
          <div className="mt-auto">
            <div className="relative">
              <button className="flex items-center gap-2 w-full py-2 px-4 rounded hover:bg-gray-700">
                <UserCircleIcon className="w-6 h-6" />
                <span>Profile</span>
              </button>
              <div className="absolute bottom-0 left-0 w-full bg-gray-700 mt-2 rounded shadow-lg hidden group-hover:block">
                <button
                  onClick={handlePreferences}
                  className="block w-full text-left py-2 px-4 hover:bg-gray-600 rounded-t"
                >
                  User Preferences
                </button>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left py-2 px-4 hover:bg-gray-600 rounded-b"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="ml-64 flex-1 p-4">
          {children}
        </div>
      </body>
    </html>
  );
}
