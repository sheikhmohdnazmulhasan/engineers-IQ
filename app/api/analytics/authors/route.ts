import { NextResponse } from 'next/server';

import connectMongodb from '@/libs/connect_mongodb';
import Article from '@/models/article.model';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const authorId = searchParams.get('_id');

    if (!authorId) {
        return NextResponse.json({ message: 'Author ID is required' }, { status: 400 });
    }

    try {
        await connectMongodb();

        // Fetch all articles by the author
        const articles = await Article.find({ author: authorId }).lean();

        // If no articles found
        if (!articles || articles.length === 0) {
            return NextResponse.json({ message: 'No articles found for the given author' }, { status: 404 });
        }

        // Total posts by author
        const totalPosts = articles.length;

        // Calculate total views, claps, comments
        const totalViews = articles.reduce((acc, article) => acc + (article.views || 0), 0);
        const totalClaps = articles.reduce((acc, article) => acc + (article.claps ? article.claps.length : 0), 0);
        const totalComments = articles.reduce((acc, article) => acc + (article.comments ? article.comments.length : 0), 0);

        // Prepare summary for each article with title, comment count, and claps count
        const articlesSummary = articles.map(article => ({
            title: article.title,
            totalComments: article.comments ? article.comments.length : 0,
            totalClaps: article.claps ? article.claps.length : 0,
        }));

        // Send response
        return NextResponse.json({
            success: true,
            message: 'Analytics retrieved successfully',
            data: {
                totalPosts,
                totalViews,
                totalClaps,
                totalComments,
                articlesSummary,
            }
        });
    } catch (error) {
        console.error('Error fetching author analytics:', error);
        return NextResponse.json({ message: 'Internal Server Error', error }, { status: 500 });
    }
}
