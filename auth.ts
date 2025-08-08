 import NextAuth from "next-auth"; 
import MicrosoftEntraID from "next-auth/providers/microsoft-entra-id"; 

export const { auth, handlers, signIn, signOut } = NextAuth({
  
  providers: [MicrosoftEntraID],
  secret: process.env.AUTH_SECRET as string,
  callbacks:{
    authorized: async({auth}) => {
      
      if (!auth?.user?.email) {
        return false; // Middleware redirects to /signin
      }

      // Fetch user existence from API (use query params for GET)
      const response = await fetch(`${process.env.NEXTAUTH_URL}/api/users?email=${encodeURIComponent(auth.user.email)}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        console.error('User check failed:', response.statusText);
        return false; // Deny access on error
      }

      const userFound = await response.json(); // Expect boolean from API

      return !!userFound;     
    },
  }
});