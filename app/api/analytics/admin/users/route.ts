import User from "@/models/users.model";
import httpStatus from "http-status";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const result = await User.find().lean();
        if (result) {
            return NextResponse.json({
                success: true,
                message: 'Users retrieved successfully',
                data: result
            }, { status: httpStatus.OK });
        } else {
            return NextResponse.json({
                success: false,
                message: 'Something went wrong!',
                data: null
            }, { status: httpStatus.BAD_REQUEST });
        }
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: 'Internal server error',
            error
        }, { status: httpStatus.INTERNAL_SERVER_ERROR });
    }
}