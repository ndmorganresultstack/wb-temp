// app/page.tsx
'use client';

import { ArrowLeftCircleIcon } from '@heroicons/react/24/solid';
import { useUser } from '@/components/rootLayoutClient';
import { trackTrace } from '@/lib/appInsights';
import { withAITracking } from '@microsoft/applicationinsights-react-js';
import { reactPlugin } from '@/lib/appInsights'; 
import { useSidebar } from './sidebarContext';
import { useEffect } from 'react';

export default withAITracking(reactPlugin, function HomePage() {
  const { user } = useUser(); // Updated to use context
  trackTrace('HomePage rendered', { user: JSON.stringify(user) });
  const {isSidebarOpen,sidebarMaxWidth,sidebarMinWidth, setPageTitle, pageTitle} = useSidebar();

  useEffect(()=>{
    if(pageTitle !== "IT Dashboard"){
      setPageTitle("IT Dashboard")
    }

  },[])

  const handleSignIn = () => {
    window.location.href = '/.auth/login/aad?post_login_redirect_uri=/';
  };

  return (
    <div className={"grid-page=container"}>
      
    </div>
  );
});