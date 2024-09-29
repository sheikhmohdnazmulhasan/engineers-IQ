import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { NextApiHandler } from "next";

export const authOptions: AuthOptions = {
    providers: [
        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "text", placeholder: "you@example.com" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials) return null;

                try {
                    const res = await fetch(`http://localhost:3000/api/auth/login`, {
                        method: 'POST',
                        body: JSON.stringify({
                            email: credentials?.email,
                            password: credentials?.password,
                        }),
                        headers: { "Content-Type": "application/json" }
                    });

                    const user = await res.json();

                    if (res.ok && user) {
                        console.log(user);

                        return user;
                    }

                    return null;
                } catch (error) {
                    console.error("Error during authorization:", error);

                    return null;
                }
            },
        }),
    ],
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: "/", // Redirect to your custom login page
    },
};

const handler: NextApiHandler = NextAuth(authOptions);

export { handler as GET, handler as POST };
