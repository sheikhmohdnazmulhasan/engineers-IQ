
import "@/styles/globals.css";
import { Metadata, Viewport } from "next";
import clsx from "clsx";
import { Toaster } from "sonner";

import { fontSans } from "@/config/fonts";
import { siteConfig } from "@/config/site";
import AuthProvider from "@/providers/auth_provider";

import { Providers } from "./providers";


export const metadata: Metadata = {
    title: {
        default: siteConfig.name,
        template: `%s - ${siteConfig.name}`,
    },
    description: siteConfig.description,
};

export const viewport: Viewport = {
    themeColor: [
        { media: "(prefers-color-scheme: light)", color: "white" },
        { media: "(prefers-color-scheme: dark)", color: "black" },
    ],
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html suppressHydrationWarning lang="en">
            <head />
            <body
                className={clsx(
                    "min-h-screen bg-background font-sans antialiased",
                    fontSans.variable,
                )}
            >
                <AuthProvider>
                    <Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
                        <Toaster />
                        <div className="relative flex flex-col h-screen">
                            <main className="container mx-auto max-w-7xl pt-16 px-6 flex-grow">
                                {children}
                            </main>
                        </div>
                    </Providers>
                </AuthProvider>
            </body>
        </html>
    );
}
