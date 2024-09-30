import { NextResponse } from "next/server";

import connectMongodb from "@/libs/connect_mongodb";
import User from "@/models/users.model";
import { IUser } from "@/interface/users.interface";

export async function POST(request: Request) {
    try {
        // Connect to the database
        await connectMongodb();

        // Parse request body
        const data: IUser = await request.json();

        // Check if email or username already exists in one query
        const userExist = await User.findOne({
            $or: [{ email: data.email }, { username: data.username }]
        });

        if (userExist) {
            if (userExist.email === data.email) {
                return NextResponse.json({ message: 'Email Already Exists' }, { status: 400 });
            }
            if (userExist.username === data.username) {
                return NextResponse.json({ message: 'Username Already Taken' }, { status: 400 });
            }
        }

        // Create the new user
        const result = await User.create(data);

        return NextResponse.json({ message: 'User Created Successfully', data: result }, { status: 201 });

    } catch (error) {
        console.error('Error creating user:', error);
        return NextResponse.json({ message: 'Failed to create user' }, { status: 500 });
    }
}
