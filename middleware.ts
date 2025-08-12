 export { auth as middleware } from "@/auth"
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.swa|api/users|api/auth).*)', // Added |api/auth to prevent checks on auth callbacks
  ],
};