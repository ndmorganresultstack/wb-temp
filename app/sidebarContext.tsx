'use client';

import { createContext, useContext, ReactNode } from 'react';

interface SidebarContextType {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  sidebarMinWidth:string;
  sidebarMaxWidth:string;
  setPageTitle: React.Dispatch<React.SetStateAction<string>>;
  pageTitle:string;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
}

export function SidebarProvider({ children, value }: { children: ReactNode; value: SidebarContextType }) {
  return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>;
}