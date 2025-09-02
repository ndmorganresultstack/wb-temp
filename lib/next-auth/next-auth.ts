"use server";

import { signIn, signOut } from "@/lib/next-auth";
import { redirect } from "next/navigation";

export async function loginWithEmail(email: string) {
	try {
		await signIn("nodemailer", { email, redirect: false, callbackUrl: "/" });
	} catch (error) {
		return { error: String(error) };
	}
	return { error: null };
}

export async function logout() {
	try {
		await signOut({ redirect: false });
	} catch (error) {
		console.log(error);
	}
	return redirect("/");
}
