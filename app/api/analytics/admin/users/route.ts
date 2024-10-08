import User from "@/models/users.model";
import httpStatus from "http-status";
import { NextResponse } from "next/server";

// Define types for response data and pagination structure
interface Pagination {
    totalUsers: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
}

interface ApiResponse {
    success: boolean;
    message: string;
    data?: any;
    pagination?: Pagination;
    error?: string;
}

export async function GET(req: Request): Promise<NextResponse<ApiResponse>> {
    try {
        // Extract query params (page and limit) from the request URL
        const { searchParams } = new URL(req.url);
        const page: number = parseInt(searchParams.get('page') || '1');
        const limit: number = parseInt(searchParams.get('limit') || '10');
        const skip: number = (page - 1) * limit;

        // Fetch users with pagination
        const users = await User.find().skip(skip).limit(limit).lean();
        const totalUsers: number = await User.countDocuments(); // Total number of users

        if (users.length > 0) {
            const pagination: Pagination = {
                totalUsers,
                totalPages: Math.ceil(totalUsers / limit),
                currentPage: page,
                pageSize: limit,
            };

            const response: ApiResponse = {
                success: true,
                message: 'Users retrieved successfully',
                data: users,
                pagination,
            };

            return NextResponse.json(response, { status: httpStatus.OK });
        } else {
            const response: ApiResponse = {
                success: false,
                message: 'No users found',
            };

            return NextResponse.json(response, { status: httpStatus.NOT_FOUND });
        }
    } catch (error: any) {
        const response: ApiResponse = {
            success: false,
            message: 'Internal server error',
            error: error.message,
        };

        return NextResponse.json(response, { status: httpStatus.INTERNAL_SERVER_ERROR });
    }
}
