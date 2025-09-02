"use client";

import { ArrowLeftCircleIcon } from "@heroicons/react/24/solid";
import { trackTrace } from "@/lib/appInsights";
import { withAITracking } from "@microsoft/applicationinsights-react-js";
import { reactPlugin } from "@/lib/appInsights";
import { useEffect } from "react";

function AccessDeniedPage() {
	useEffect(() => {
		trackTrace("Access Denied page rendered", { page: "/access-denied" });
	}, []);

	const handleSignIn = () => {
		window.location.href = "/.auth/login/aad?post_login_redirect_uri=/dashboard";
	};

	return (
		<div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-8 font-roboto-condensed">
			<h1 className="text-3xl font-bold mb-4 text-red-600">Access Denied</h1>
			<p className="text-lg mb-4 text-center">
				You do not have permission to access the Willowbridge IT Dashboard. Please contact
				your administrator to request access.
			</p>
			<button
				onClick={handleSignIn}
				className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center transition-colors"
				aria-label="Sign in to Willowbridge IT Dashboard"
			>
				<ArrowLeftCircleIcon className="w-5 h-5 mr-2" />
				Try Signing In
			</button>
		</div>
	);
}

export default withAITracking(reactPlugin, AccessDeniedPage);
