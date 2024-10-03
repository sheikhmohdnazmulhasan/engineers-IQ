import { NextResponse } from "next/server";

// Creating new article
export async function POST(request: Request) {
    const data = await request.json();

    console.log(data);

    return NextResponse.json("hello")
}