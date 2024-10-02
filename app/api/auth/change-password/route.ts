import httpStatus from "http-status";
import { NextResponse } from "next/server";

export async function PATCH(request: Request) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('user');
    const { auth, newPassword } = await request.json();

    if (!auth) {
        return NextResponse.json({
            success: false,
            message: 'Authorized Request'
        }, { status: httpStatus.UNAUTHORIZED });
    }

    try {

    } catch (error) {

    }

}