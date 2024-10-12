/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

import connectMongodb from "@/libs/connect_mongodb";
import User from "@/models/users.model";
import { decrypt } from "@/utils/text_encryptor";

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

        // Fetch users, prioritizing "admin" role, then the rest, sorted by creation date
        const users = await User.aggregate([
            {
                $addFields: {
                    isAdmin: {
                        $cond: { if: { $eq: ["$role", "admin"] }, then: 1, else: 0 },
                    },
                },
            },
            { $sort: { isAdmin: -1, createdAt: -1 } },
            { $skip: skip },
            { $limit: limit },
        ]);

        const totalUsers: number = await User.countDocuments();

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

export async function PATCH(req: Request) {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get('token');
    const userId = searchParams.get('_id');
    const action = searchParams.get('action');

    try {
        await connectMongodb();
        const decryptedToken = decrypt(token as string);

        const session = await mongoose.startSession();

        return await session.withTransaction(async () => {
            const isAdmin = await User.findById(decryptedToken).select('role').lean().session(session);

            // @ts-ignore: role is always exist
            if (!isAdmin || isAdmin.role !== 'admin') {
                throw new Error('Unauthorized action');
            }

            const user = await User.findById(userId).select('role isBlocked name').session(session);
            if (!user) throw new Error('User Not found');

            if (action === 'role') {
                user.role = user.role === 'admin' ? 'user' : 'admin';
                await user.save();

                return NextResponse.json({
                    success: true,
                    message: `${user.name}'s role updated`,
                }, { status: httpStatus.OK });

            } else if (action === 'status') {
                user.isBlocked = !user.isBlocked;
                await user.save();

                return NextResponse.json({
                    success: true,
                    message: `${user.name}'s status updated`,
                }, { status: httpStatus.OK });

            } else {
                throw new Error('Invalid action');
            }
        });

    } catch (error: any) {
        return NextResponse.json({
            success: false,
            message: error.message || 'Internal server error',
        }, { status: httpStatus.INTERNAL_SERVER_ERROR });
    }
}


export async function DELETE(req: Request) {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get('token');
    const userId = searchParams.get('_id');

    let session: mongoose.ClientSession | null = null;

    try {
        await connectMongodb();
        const decryptedToken = decrypt(token as unknown as string);

        session = await mongoose.startSession();
        session.startTransaction();


        const isAdmin = await User.findById(decryptedToken).select('role').lean().session(session);

        // @ts-ignore: role is always exist
        if (!isAdmin || isAdmin.role !== 'admin') {
            await session.abortTransaction();

            return NextResponse.json({
                success: false,
                message: 'Unauthorized action',
            }, { status: httpStatus.UNAUTHORIZED });
        }

        const result = await User.findByIdAndDelete(userId);

        if (!result) {
            await session.abortTransaction();

            return NextResponse.json({
                success: false,
                message: 'Failed to delete user'
            }, { status: httpStatus.BAD_REQUEST });
        };

        await session.commitTransaction();
        session.endSession();

        return NextResponse.json({
            success: true,
            message: 'User deleted successfully',
        }, { status: httpStatus.OK });

    } catch (error) {
        if (session) {
            await session.abortTransaction();
            session.endSession();
        }
        return NextResponse.json({
            success: false,
            message: 'Something went wrong',
            error
        }, { status: httpStatus.INTERNAL_SERVER_ERROR })
    }
}
