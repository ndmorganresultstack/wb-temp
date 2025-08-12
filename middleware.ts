 export { auth as middleware } from "@/auth"
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.swa|api/users).*)', // Exclude SWA health check and static assets
  ],
} 