'use client'

import { useState, } from 'react'
import Image from 'next/image'
import { Heart, MessageCircle, Share } from 'lucide-react'
import { Button, Avatar, Card, CardBody } from "@nextui-org/react"
import { motion, } from 'framer-motion'
import Link from 'next/link'
import DOMPurify from 'dompurify';
import { toast } from 'sonner'

import useArticle from '@/hooks/use_articles'
import { IArticleResponse, IClap, IComment } from '@/interface/articles.response.interface'
import formatDateReadable from '@/utils/format_date_readable'
import UserName from '@/components/premium_acc_badge'
import useUser from '@/hooks/useUser'
import axiosInstance from '@/libs/axiosInstance'

import { CommentDrawer } from './CommentDrawer'

export interface Comment {
    author: string
    avatar: string
    date: string
    content: string
    likes: number
    liked: boolean
}

const BlogDetails = ({ params }: { params: { postId: string } }) => {
    const { currentUser } = useUser();
    const { data, revalidate } = useArticle({ _id: params.postId });
    const article = Array.isArray(data) ? data[0] : data as IArticleResponse | null;
    const [isCommentDrawerOpen, setIsCommentDrawerOpen] = useState(false);
    const [newCommentLoading, setNewCommentLoading] = useState<boolean>(false);

    const hasClapped = article?.claps.some((clap: IClap) => clap._id === currentUser?._id);

    async function handleClapped() {
        if (!currentUser) {
            toast.error('You are not logged in', {
                position: 'bottom-left'
            });
            return;
        };
        try {
            setNewCommentLoading(true);
            await axiosInstance.patch('/articles/clap', {
                articleId: article?._id,
                user: currentUser?._id
            });
            revalidate();
            setNewCommentLoading(false);
        } catch (error) {
            setNewCommentLoading(false);
            toast.error('Something Bad Happened!');
        }
    }

    return (

        <div className=" mx-auto ">
            <motion.div
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
                initial={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="text-2xl md:text-4xl font-bold mb-4">{article?.title}</h1>
                <div className="flex items-center space-x-4 mb-4">
                    <Avatar name={article?.author.name} src={article?.author?.profileImg} />
                    <div>
                        <Link className="hover:underline" href={`/profile/${article?.author.username}`}>
                            <UserName isPremium={article?.author.isPremiumMember} name={article?.author?.name} />
                        </Link>
                        <p className="text-sm text-gray-500">Published in {formatDateReadable(article?.createdAt as string)}</p>
                    </div>
                </div>
                <div className="hidden md:flex items-center space-x-4 text-gray-500">
                    <Button
                        className={`mt-2 p-0 ${hasClapped ? 'text-danger' : null}`}
                        isLoading={newCommentLoading}
                        size="sm"
                        startContent={<Heart className={`w-5 h-5 ${hasClapped ? 'fill-current text-danger' : ''}`} />}
                        variant="light"
                        onPress={handleClapped}
                    >
                        {article?.claps.length}
                    </Button>

                    <Button size="sm" startContent={<MessageCircle className="w-5 h-5" />} variant="light" onPress={() => setIsCommentDrawerOpen(true)}>
                        {article?.comments.length}
                    </Button>

                    <Button size="sm" startContent={<Share className="w-5 h-5" />
                    } variant="light" onPress={() => console.log('hello')}>
                        {article?.shares}
                    </Button>
                </div>
            </motion.div>

            <motion.div
                animate={{ opacity: 1, scale: 1 }}
                initial={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5 }}
            >
                <Image
                    alt={article?.title as string}
                    className="w-full h-auto mb-8 rounded-lg"
                    height={300}
                    src={article?.images[0] as string}
                    width={700}
                />
            </motion.div>

            <motion.div
                animate={{ opacity: 1 }}
                className="prose max-w-none"
                initial={{ opacity: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
            >
                <div className='no-tailwind'>
                    <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(article?.description as string) }} />
                </div>
            </motion.div>

            <Card
                isBlurred
                className="fixed md:hidden bottom-1 left-1 right-1 bg-background/60 dark:bg-default-100/50 z-[100]"
                shadow="sm"
            >
                <CardBody>
                    <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-4">
                            <Button size="sm" startContent={<Heart className="w-6 h-6" />} variant="light">
                                13
                            </Button>
                            <Button size="sm" startContent={<MessageCircle className="w-6 h-6" />} variant="light" onPress={() => setIsCommentDrawerOpen(!isCommentDrawerOpen)}>
                                {article?.shares}
                            </Button>
                        </div>
                        <div className="flex items-center space-x-4">
                            <Button isIconOnly size="sm" variant="light">
                                <Share className="w-6 h-6" />
                            </Button>
                        </div>
                    </div>
                </CardBody>
            </Card>

            <CommentDrawer
                articleId={params.postId}
                comments={article?.comments as IComment[]}
                isOpen={isCommentDrawerOpen}
                revalidate={revalidate}
                onClose={() => setIsCommentDrawerOpen(false)}
            />
        </div>
    )
}

export default BlogDetails