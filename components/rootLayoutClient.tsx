'use client';

import Link from 'next/link';
import Image from 'next/image';
import { UserIcon } from '@heroicons/react/20/solid';
import { ClientPrincipal } from '@/lib/auth';
import { createContext, useContext, useEffect, useState } from 'react';
import { initializeAppInsights, trackTrace, reactPlugin } from '@/lib/appInsights';
import { withAITracking } from '@microsoft/applicationinsights-react-js';
import GetUserClient from './getUserClient';
import { UserCircleIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline'; 

import '../app/globals.css'; 
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

const UserContext = createContext<{
  user: ClientPrincipal | null;
  setUser: (user: ClientPrincipal | null) => void;
}>({ user: null, setUser: () => {} });

export function useUser() {
  return useContext(UserContext);
}

function RootLayoutClient({
  children,
  user,
}: Readonly<{
  children: React.ReactNode;
  user: ClientPrincipal | null;
}>) {
  useEffect(() => {
    initializeAppInsights(); // Initialize client-side
    trackTrace('RootLayoutClient rendered', { user: JSON.stringify(user) });
  }, [user]);

  const [userState, setUserState] = useState<ClientPrincipal | null>(user);
  const [isSidebarHovered, setIsSidebarHovered] = useState(false);

  const menuItems = [
    {
      name: 'Costs',
      icon: CurrencyDollarIcon,
      subItems: [
        { name: 'Internal Labor', href: '/internal-labor' }, 
      ],
    },
    {
      name: 'Employees',
      icon: UserIcon,
      subItems: [{ name: 'Employee Roster', href: '/employees' }],
    },
  ];

  const handleLogout = () => {
    window.location.href = '/.auth/logout?post_logout_redirect_uri=/';
  };

  const handlePreferences = () => {
    trackTrace('User preferences clicked');
  };

  return (
    <UserContext.Provider value={{ user: userState, setUser: setUserState }}>
      <div
        className={`${robotoCondensed.variable} ${robotoMono.variable} ${robotoSerif.variable} antialiased flex min-h-screen relative`}
      >
        <div
          className={`w-[50px] bg-[#37474F] text-white p-2 h-screen absolute top-0 left-0 z-50 flex flex-col transition-all duration-300 ${
            isSidebarHovered ? 'w-[150px]' : 'w-[50px]'
          }`}
          onMouseEnter={() => setIsSidebarHovered(true)}
          onMouseLeave={() => setIsSidebarHovered(false)}
        >
          <div className="mb-8 mt-8">
            <Link href="/">
              <Image
                src={isSidebarHovered ? '/header_logo_w.png' : '/header_logo_s.png'}
                alt="Willowbridge Logo"
                width={isSidebarHovered ? 130 : 40}
                height={40}
                className="hover:opacity-80 transition-opacity"
              />
            </Link>
          </div>
          <nav className="space-y-4 flex-1">
            {menuItems.map((item) => (
              <div key={item.name} className="relative group/sub">
                <a
                  className="block p-2 rounded hover:bg-[#37474F] flex items-center"
                  title={item.name}
                >
                  <item.icon className="w-6 h-6 flex-shrink-0" />
                  <span className={`text-sm ml-2 ${isSidebarHovered ? 'block' : 'hidden'}`}>
                    {item.name}
                  </span>
                </a>
                <div
                  className="absolute left-full top-0 w-48 bg-[#37474F] mt-0 rounded shadow-lg hidden group-hover/sub:block z-50"
                >
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
          <div className="mt-auto">
            <div className="relative group/sub">
              <button className="flex items-center w-full p-2 rounded hover:bg-gray-700">
                <UserCircleIcon className="w-6 h-6 flex-shrink-0" />
                <span className={`text-sm ml-2 ${isSidebarHovered ? 'block' : 'hidden'}`}>
                  {user?.userDetails || 'Guest'}
                </span>
              </button>
              <div
                className="absolute bottom-0 left-full w-40 bg-gray-700 mt-2 rounded shadow-lg hidden group-hover/sub:block z-50"
              >
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
        <main className="flex-1 overflow-y-auto ml-13 mt-1">
          <GetUserClient />
          {children}
        </main>
      </div>
    </UserContext.Provider>
  );
}

export default withAITracking(reactPlugin, RootLayoutClient);