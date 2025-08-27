'use client';

import Link from 'next/link';
import Image from 'next/image';
import { BellAlertIcon, Cog6ToothIcon, QuestionMarkCircleIcon, DocumentIcon, UsersIcon  } from '@heroicons/react/24/outline';
import { CircleStackIcon, ClipboardDocumentIcon, Cog8ToothIcon, ComputerDesktopIcon, CurrencyDollarIcon,DocumentTextIcon,HomeIcon,HomeModernIcon,ListBulletIcon,MagnifyingGlassCircleIcon,MagnifyingGlassIcon,UserIcon } from '@heroicons/react/24/solid';
import { ClientPrincipal } from '@/lib/auth';
import { ComponentType, createContext, SetStateAction, SVGProps, useContext, useEffect, useState } from 'react';
import { initializeAppInsights, trackTrace, reactPlugin } from '@/lib/appInsights';
import { withAITracking } from '@microsoft/applicationinsights-react-js';
import { SidebarProvider } from '../app/sidebarContext'; 
import '../app/globals.css';
import { Roboto_Condensed, Roboto_Mono, Roboto_Serif } from 'next/font/google';
import { SidebarManager } from './sideBarManager';

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
  weight: ['300', '400', '700'],
  variable: '--font-roboto-condensed',
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
  const [userState, setUserState] = useState<ClientPrincipal | null>(user);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const [expandedSubItem, setExpandedSubItem] = useState<string | null>(null);
  const [menuItem, setMenuItem] = useState<string | null>(null);
  const [pageTitle, setPageTitle] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string | null>(null);


  const sidebarMaxWidth='0px';
  const sidebarMinWidth='0px';

  useEffect(() => {
    initializeAppInsights();
    trackTrace('RootLayoutClient rendered', { user: JSON.stringify(user) });
  }, [user]);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const toggleAccordion = (itemName: string) => {
    setExpandedItem(expandedItem === itemName ? null : itemName);
  };

  const handleLogout = () => {
    window.location.href = '/.auth/logout?post_logout_redirect_uri=/';
  };

  const handlePreferences = () => {
    trackTrace('User preferences clicked');
  };

  return (
    <UserContext.Provider value={{ user: userState, setUser: setUserState }}>
      <SidebarProvider value={{ isSidebarOpen, toggleSidebar, sidebarMinWidth , sidebarMaxWidth, setPageTitle, pageTitle}}>
        <div
          className={`${robotoCondensed.variable} ${robotoMono.variable} ${robotoSerif.variable} antialiased flex h-screen`}
        >
          <SidebarManager
            isSidebarOpen={isSidebarOpen}
            toggleSidebar={toggleSidebar}
            expandedItem={expandedItem}
            setExpandedItem={setExpandedItem}
            setMenuItem={setMenuItem}
            menuItem={menuItem}
            sidebarMaxWidth={sidebarMaxWidth}
            sidebarMinWidth={sidebarMinWidth}
            pageTitle={pageTitle}
            setPageTitle={setPageTitle}
            expandedSubItem={expandedSubItem}
            setExpandedSubItem={setExpandedSubItem} 
            searchQuery={searchQuery} 
            setSearchQuery={setSearchQuery}
            userState={user}
            />
          <div className="flex-1 flex flex-col transition-all duration-300 ease-in-out">
            <header
                className={`bg-[var(--wb-background-color)] text-white p-2 flex justify-between items-center transition-all h-14 duration-300 ease-in-out border-b border-gray-200 ${
                isSidebarOpen ? 'ml-0' : 'ml-16px'
                }`}
            >
              <div className="flex items-center">
                <button
                  onClick={toggleSidebar}
                  className="lg:hidden mr-2 text-white hover:text-gray-300 focus:outline-none"
                >
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d={isSidebarOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
                    />
                  </svg>
                </button>
                <span className="sitePageTitle">{pageTitle}</span>
              </div>
              <div className="flex items-center space-x-4">  
               
                  <BellAlertIcon className="w-5 h-5 flex-shrink-0 text-white-600" />
                  <QuestionMarkCircleIcon className="w-5 h-4 flex-shrink-0 text-white-600" />
                  <Cog6ToothIcon className="w-5 h-5 flex-shrink-0 text-white-600" />
                   
              </div>
            </header>

            {/* Main Content Area */}
            <main>{children}</main>
          </div>
        </div>
      </SidebarProvider>
    </UserContext.Provider>
  );
}

export default withAITracking(reactPlugin, RootLayoutClient);