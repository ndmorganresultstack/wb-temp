"use server";

import { signOut, signIn, auth } from "@/auth"; 

export const login = async () => {
    await signIn("microsoft-entra-id",{redirectTo: '/'});

}

export const logout = async () => {
    await signOut({redirectTo: '/'});
}
