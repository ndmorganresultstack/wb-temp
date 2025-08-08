"use client";

import { ArrowLeftCircleIcon } from "@heroicons/react/24/solid";
import "./globals.css";
import { login } from "@/lib/actions/auth";  
import { useSession } from "next-auth/react"

export default function HomePage() {
 
  const { data: session } = useSession()

  return (
    <div className="flex flex-col items-start justify-center max-h-screen bg-gray-100">
     {!session &&     
        <button onClick={() => login()}>Sign In</button>
     }
    </div>
  );
}


