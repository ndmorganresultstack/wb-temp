import { type DefaultSession, type NextAuthConfig } from "next-auth";
import type { DefaultJWT } from "next-auth/jwt";

import Nodemailer from "next-auth/providers/nodemailer";

import { db } from "@/lib/prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { createTransport } from "nodemailer";
import { verificationEmailHTML } from "./verificationEmailHTML";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
	interface Session extends DefaultSession {
		user: {
			id: string;
			// ...other properties
			// role: UserRole;
		} & DefaultSession["user"];
	}
}

declare module "next-auth/jwt" {
	interface JWT extends DefaultJWT {
		id?: string;
	}
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authConfig = {
	adapter: PrismaAdapter(db),
	pages: {
		// signIn: "/login",
	},
	callbacks: {
		jwt: async ({ token, user }) => {
			if (user) token.id = user.id;
			return token;
		},
		session: ({ session, user }) => ({
			...session,
			user: {
				...session.user,
				id: user.id,
			},
		}),
	},
	providers: [
		Nodemailer({
			server: {
				host: process.env.AUTH_EMAIL_HOST,
				port: parseInt(process.env.AUTH_EMAIL_PORT!),
				auth: {
					user: process.env.AUTH_EMAIL_USER,
					pass: process.env.AUTH_EMAIL_PASSWORD,
				},
			},
			from: `Willow Bridge <${process.env.AUTH_EMAIL_FROM}>`,
			async sendVerificationRequest({ identifier: email, url, provider }) {
				const transport = createTransport(provider.server);
				const result = await transport.sendMail({
					to: email,
					from: provider.from,
					subject: "Sign in to Willow Bridge",
					text: `Sign in to Willow Bridge\n${url}\n\n`,
					html: verificationEmailHTML(email, url),
				});
				const rejected = result.rejected || [];
				const pending = result.pending || [];
				const failed = rejected.concat(pending).filter(Boolean);
				if (failed.length) {
					throw new Error(`Email (${failed.join(", ")}) could not be sent`);
				}
			},
		}),
	],
} satisfies NextAuthConfig;
