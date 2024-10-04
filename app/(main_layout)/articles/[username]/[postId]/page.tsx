'use client'

import { useState, } from 'react'
import Image from 'next/image'
import { Heart, MessageCircle, Share } from 'lucide-react'
import { Button, Avatar, Card, CardBody } from "@nextui-org/react"
import { motion, } from 'framer-motion'
import Link from 'next/link'
import DOMPurify from 'dompurify';

import useArticle from '@/hooks/use_articles'
import Loading from '@/components/loading'
import { IArticleResponse, IComment } from '@/interface/articles.response.interface'
import formatDateReadable from '@/utils/format_date_readable'
import UserName from '@/components/premium_acc_badge'

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
    const { data, isLoading } = useArticle({ _id: params.postId });
    const article = Array.isArray(data) ? data[0] : data as IArticleResponse | null
    const [isCommentDrawerOpen, setIsCommentDrawerOpen] = useState(false);

    const [comments, setComments] = useState<Comment[]>([
        {
            author: "Jane Doe",
            avatar: "/placeholder.svg?height=40&width=40",
            date: "2 days ago",
            content: "Great article! I learned a lot about GraphQL and Express.",
            likes: 5,
            liked: false
        },
        {
            author: "John Smith",
            avatar: "/placeholder.svg?height=40&width=40",
            date: "1 day ago",
            content: "Thanks for the beginner-friendly guide. Looking forward to more content like this!",
            likes: 3,
            liked: false
        }
    ])

    const handleLikeComment = (index: number) => {
        setComments(prevComments =>
            prevComments.map((comment, i) =>
                i === index
                    ? { ...comment, likes: comment.liked ? comment.likes - 1 : comment.likes + 1, liked: !comment.liked }
                    : comment
            )
        )
    }

    return (
        <>
            {isLoading && <Loading />}
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
                        <Button size="sm" startContent={<Heart className="w-5 h-5" />} variant="light">
                            13
                        </Button>
                        <Button size="sm" startContent={<MessageCircle className="w-5 h-5" />} variant="light" onPress={() => setIsCommentDrawerOpen(true)}>
                            {comments.length}
                        </Button>

                        <Button size="sm" startContent={<Share className="w-5 h-5" />
                        } variant="light" onPress={() => console.log('hello')}>
                            {comments.length}
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
                                    {comments.length}
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
                    comments={article?.comments as IComment[]}
                    isOpen={isCommentDrawerOpen}
                    onClose={() => setIsCommentDrawerOpen(false)}
                    onLikeComment={handleLikeComment}
                />
            </div>
        </>
    )
}

export default BlogDetails