import { NextRequest, NextResponse } from "next/server";

export async function auth(req: NextRequest) {
  const response = await fetch(`${process.env.NEXTAUTH_URL}/.auth/me`, {
    headers: { "X-MS-CLIENT-PRINCIPAL": req.headers.get("x-ms-client-principal") || "" },
  });
  const data = await response.json();
  const user = data?.clientPrincipal;

  if (!user?.userDetails) {
    return false; // No user, redirect to login
  }

  // Verify user exists in DB (same as before)
  const userCheck = await fetch(`${process.env.NEXTAUTH_URL}/api/users?email=${encodeURIComponent(user.userDetails)}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!userCheck.ok) {
    console.error("User check failed:", userCheck.statusText);
    return false;
  }

  return !!(await userCheck.json());
}