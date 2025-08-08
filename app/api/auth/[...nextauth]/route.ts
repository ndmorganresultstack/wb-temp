// app/api/auth/[...nextauth]/route.ts
import { handlers } from "@/auth";  // Adjust path if src/auth.ts

export const { GET, POST } = handlers;