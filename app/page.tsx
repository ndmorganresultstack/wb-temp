// app/page.tsx
'use client';

import { ArrowLeftCircleIcon } from '@heroicons/react/24/solid';
import { useUser } from '@/components/rootLayoutClient';
import { trackTrace } from '@/lib/appInsights';
import { withAITracking } from '@microsoft/applicationinsights-react-js';
import { reactPlugin } from '@/lib/appInsights';

export default withAITracking(reactPlugin, function HomePage() {
  const { user } = useUser(); // Updated to use context
  trackTrace('HomePage rendered', { user: JSON.stringify(user) });

  const handleSignIn = () => {
    window.location.href = '/.auth/login/aad?post_login_redirect_uri=/';
  };

  return (
    <div className="flex flex-col items-start justify-center min-h-screen bg-gray-100 p-8 font-roboto-condensed">
      {user ? (
       <></>
      ) : (
        <div>
          <h1 className="text-3xl font-bold mb-4">Willowbridge IT Dashboard</h1>
          <p className="text-lg mb-4">Sign in to manage IT cost data, including Internal Labor, External Labor, and Employee costs.</p>
          <button
            onClick={handleSignIn}
            className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center transition-colors"
            aria-label="Sign in to Willowbridge IT Dashboard"
          >
            <ArrowLeftCircleIcon className="w-5 h-5 mr-2" />
            Sign In
          </button>
        </div>
      )}
    </div>
  );
});