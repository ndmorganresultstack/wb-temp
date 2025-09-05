// app/api/users/route.ts
import { NextRequest, NextResponse } from "next/server";
import { trackTrace, trackException } from "@/lib/appInsights";

export async function GET(request: NextRequest) {
	try {
		trackTrace("Users API endpoint called", {
			url: request.url,
			method: request.method,
		});

		// Get clientPrincipal from x-ms-client-principal header
		const clientPrincipalHeader = request.headers.get("x-ms-client-principal");
		if (!clientPrincipalHeader) {
			trackTrace("Users API: No clientPrincipal header", { url: request.url });
			return NextResponse.json({ error: "No authentication data provided" }, { status: 401 });
		}

		// Decode the base64-encoded clientPrincipal
		const decoded = Buffer.from(clientPrincipalHeader, "base64").toString("utf-8");
		const clientPrincipal: any = JSON.parse(decoded);

		trackTrace("Users API: User info retrieved", {
			userId: clientPrincipal.userId || "unknown",
			identityProvider: clientPrincipal.identityProvider || "unknown",
		});

		return NextResponse.json(clientPrincipal);
	} catch (error: any) {
		trackException(error, { endpoint: "/api/users", url: request.url });
		return NextResponse.json(
			{ error: "Internal server error", message: error.message },
			{ status: 500 }
		);
	}
}
