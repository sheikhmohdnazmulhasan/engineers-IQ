import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    console.log(pathname);

    const token = await getToken({
        req: request,
        secret: process.env.NEXT_PUBLIC_NEXTAUTH_SECRET,
    });

    if (token) {
        return NextResponse.redirect(new URL("/", request.url));
    } else {
        return NextResponse.next();
    }
}

export const config = {
    matcher: ["/auth/login"],
};