"use client";

import { ArrowLeftCircleIcon } from "@heroicons/react/24/solid";
import "./globals.css"; 

export default function HomePage() {
 
  const session = getUserInfo();

  async function getUserInfo() {
    const response = await fetch('/.auth/me');
    const payload = await response.json();
    const { clientPrincipal } = payload;
    return clientPrincipal;
  }


  return (
    <div className="flex flex-col items-start justify-center max-h-screen bg-gray-100">
     {!session &&     
        <button  >Sign In</button>
     }
    </div>
  );
}


