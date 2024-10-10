import { NextResponse } from 'next/server';

import User from '@/models/users.model';

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('query');

    if (!query) {
        return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
    }

    try {
        // Check if query is an email (simple email validation)
        const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(query);

        // Find user by email or username
        const user = await User.findOne(isEmail ? { email: query } : { username: query }).select('email name username').lean();

        if (!user) {

            return NextResponse.json({ error: 'No users were found based on your query' }, { status: 404 });
        }

        return NextResponse.json({ data: user }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
    }
}
