'use client';
 
import '../app/globals.css';
import { UserCircleIcon, CurrencyDollarIcon } from "@heroicons/react/24/outline";
import { Roboto_Condensed, Roboto_Mono, Roboto_Serif } from "next/font/google";
import Link from 'next/link';
import Image from 'next/image';
import { UserIcon } from '@heroicons/react/20/solid';
import { logout } from '@/lib/actions/auth';
import { useSession } from 'next-auth/react';

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

export default function RootLayoutClient({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) { 

  const {data:session} = useSession();

  const menuItems = [
    {
      name: "Costs",
      icon: CurrencyDollarIcon,
      subItems: [
        { name: "Internal Labor", href: "/internal-labor" },
        { name: "External Labor", href: "/external-labor" },
        //{ name: "Software", href: "/software-costs" },
      ],
    },
    {
      name: "Employees",
      icon: UserIcon,
      subItems: [
        { name: "Employee Roster", href: "/employees" },
      ],
    },
  ];

  const handleLogout = () => {
    logout();
  };

  const handlePreferences = () => {
    // Implement user preferences logic here (e.g., open modal or navigate to settings)
    console.log("Preferences clicked");
    // Example: window.location.href = '/settings';
  };

  return (
    <body
      className={`${robotoCondensed.variable} ${robotoMono.variable} ${robotoSerif.variable} antialiased flex min-h-screen relative`}
    >
      {/* Sidebar */}
      <div
        className="w-[50px] bg-gray-800 text-white p-2 h-screen fixed top-0 left-0 z-50 flex flex-col items-center"
      >
        <div className="mb-8">
          <Link href="/">
            <Image
              src="/header_logo_w.png" // Path to your SVG in the public directory
              alt="Willowbridge Logo"
              width={40} // Adjust based on your SVG size
              height={40} // Adjust based on your SVG size
              className="hover:opacity-80 transition-opacity"
            />
          </Link>
        </div>
        <nav className="space-y-4 flex-1">
          {menuItems.map((item) => (
            <div key={item.name} className="relative group">
              <a
                className="block p-2 rounded hover:bg-gray-700 flex justify-center"
                title={item.name} // Tooltip for icon
              >
                <item.icon className="w-6 h-6" />
              </a>
              <div className="absolute left-full top-0 w-48 bg-gray-700 mt-0 rounded shadow-lg hidden group-hover:block z-50">
                <div className="text-sm font-semibold text-white px-4 py-2 border-b border-gray-600">
                  {item.name}
                </div>
                {item.subItems.map((subItem) => (
                  <a
                    key={subItem.name}
                    href={subItem.href}
                    className="block text-sm text-white py-2 px-4 hover:bg-gray-600"
                  >
                    {subItem.name}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </nav>
        {/* Profile Dropdown */}
        <div className="mt-auto">
          <div className="relative group">
            <button className="flex items-center justify-center w-full p-2 rounded hover:bg-gray-700">
              <UserCircleIcon className="w-6 h-6" />
            </button>
            <div className="absolute bottom-0 left-full w-40 bg-gray-700 mt-2 rounded shadow-lg hidden group-hover:block">
              
              <div className="flex items-center justify-center"><span>{session?.user?.name}</span></div>
              <button
                onClick={handlePreferences}
                className="block w-full text-left py-2 px-4 hover:bg-gray-600 rounded-t text-sm"
              >
                User Preferences
              </button>
              <button
                onClick={handleLogout}
                className="block w-full text-left py-2 px-4 hover:bg-gray-600 rounded-b text-sm"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 overflow-y-auto" style={{ marginLeft: '50px' }}>
        {children}
      </div>
    </body>
  );
}