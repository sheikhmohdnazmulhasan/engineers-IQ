import { NextResponse } from "next/server";

import connectMongodb from "@/libs/connect_mongodb";

import Pay from "./model";

export async function POST(req: Request) {
    const data = await req.json()
    try {
        await connectMongodb()
        await Pay.create(data);

        return NextResponse.json({
            success: true,
            message: 'record saved',
        }, { status: 200 });

    } catch (error) {
        return NextResponse.json({
            success: false,
            message: 'failed to save payment record in database',
        }, { status: 500 })
    }
}

export async function GET() {
    try {
        const result = await Pay.find();

        return NextResponse.json({
            success: true,
            data: result
        })
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: 'failed to save payment record in database',
        }, { status: 500 })
    }
}