'use client';

import Link from 'next/link';
import Image from 'next/image';
import { BellAlertIcon, Cog6ToothIcon, QuestionMarkCircleIcon } from '@heroicons/react/24/outline';
import { CurrencyDollarIcon,UserIcon } from '@heroicons/react/24/solid';
import { ClientPrincipal } from '@/lib/auth';
import { createContext, useContext, useEffect, useState } from 'react';
import { initializeAppInsights, trackTrace, reactPlugin } from '@/lib/appInsights';
import { withAITracking } from '@microsoft/applicationinsights-react-js';
import { SidebarProvider } from '../app/sidebarContext'; 
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

// Define the prop interface for SidebarManager
interface SidebarManagerProps {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  expandedItem: string | null;
  menuItem: string | null;
  setExpandedItem: React.Dispatch<React.SetStateAction<string | null>>;
  setMenuItem: React.Dispatch<React.SetStateAction<string | null>>;
  sidebarMinWidth: string | null;
  sidebarMaxWidth: string | null;
  pageTitle: string | null;
  setPageTitle: React.Dispatch<React.SetStateAction<string>>; 
}

// SidebarManager component to handle sidebar logic
const SidebarManager = ({ isSidebarOpen, toggleSidebar, expandedItem, setExpandedItem, setMenuItem, menuItem, sidebarMinWidth, sidebarMaxWidth, setPageTitle, pageTitle }:SidebarManagerProps) => {
  const toggleAccordion = (itemName: string) => {
    setExpandedItem(expandedItem === itemName ? null : itemName);
  };

  const menuItems = [
    {
      name: 'Costs',
      icon: CurrencyDollarIcon,
      subItems: [
        { name: 'Internal Labor', href: '/internal-labor' },
        { name: 'External Labor', href: '/external-labor' },
        { name: 'Software Costs', href: '/software-costs' },
      ],
    },
    {
      name: 'Employees',
      icon: UserIcon,
      subItems: [{ name: 'Employee Roster', href: '/employees' }],
    },
  ];

  return (
    <div
      className={`fixed inset-y-0 left-0 z-50 bg-white shadow-lg transition-all duration-300 ease-in-out ${
        isSidebarOpen ? 'w-[300px] translate-x-0' : 'w-[71px] -translate-x-0'
      } lg:${isSidebarOpen ? 'w-[300px]' : 'w-[71px]'} lg:static`}
    >
      <div className="flex h-14 items-center px-2 bg-[var(--wb-background-color)] border-b border-gray-200">
        <button
          onClick={toggleSidebar}
          className={`text-white hover:text-white focus:outline-none ${isSidebarOpen ? 'mx-[15.5px]' : 'mx-auto'}`}
        >
          {isSidebarOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="3"
              stroke="currentColor"
              className="size-6 border border-white p-1 rounded "
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5 8.25 12l7.5-7.5"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="3"
              stroke="currentColor"
              className="size-6 border border-white p-1 rounded "
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m8.25 4.5 7.5 7.5-7.5 7.5"
              />
            </svg>
          )}
        </button>
        {isSidebarOpen && (
          <Link
           href={"/"}
          >
            <Image
              src="/header_logo_w.png"
              alt="Willowbridge Logo"
              width={80}
              height={10}
              className="hover:opacity-80 transition-opacity mx-[45px]"
            />
          </Link>
        )}
      </div>
      <nav className="mt-4 mx-[15.5px]">
        <ul>
          {menuItems.map((item) => (
            <li key={item.name} className="relative">
              <button
                onClick={() => { if(!isSidebarOpen){ toggleSidebar() } toggleAccordion(item.name)}}
                className="w-full p-2 rounded hover:bg-gray-100 flex items-center focus:outline-none"
              >
                <item.icon className="w-6 h-6 flex-shrink-0 text-gray-600" />
                {isSidebarOpen && (
                  <>
                    <span className="text-sm ml-2 text-gray-700">{item.name}</span>
                    <svg
                      className={`w-4 h-4 ml-auto transform transition-transform ${
                        expandedItem === item.name ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </>
                )}
              </button>
              {isSidebarOpen && item.subItems.length > 0 && expandedItem === item.name && (
                <div className="pl-8 mt-1 space-y-1">
                  {item.subItems.map((subItem) => (
                    <Link
                      key={subItem.name}
                      href={subItem.href}
                      className={`block text-sm text-gray-700 py-1 px-2 hover:bg-gray-100 rounded w-[80%] 
                        ${menuItem === subItem.href ? ' font-bold  bg-gray-100 border-l-4' : ''}
                        `}
                      onClick={(e) => {setMenuItem(subItem.href)}}
                    >
                      {subItem.name}
                    </Link>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

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
  const [menuItem, setMenuItem] = useState<string | null>(null);
  const [pageTitle, setPageTitle] = useState<string>("IT Dashboard");


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