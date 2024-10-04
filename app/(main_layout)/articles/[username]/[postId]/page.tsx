'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Heart, MessageCircle, Bookmark, Share2, X } from 'lucide-react'
import { Button, Textarea, Avatar, Card, CardBody } from "@nextui-org/react"
import { motion, AnimatePresence } from 'framer-motion'

interface Comment {
    author: string
    avatar: string
    date: string
    content: string
    likes: number
    liked: boolean
}

interface CommentDrawerProps {
    isOpen: boolean
    onClose: () => void
    comments: Comment[]
    onLikeComment: (index: number) => void
}

const CommentDrawer: React.FC<CommentDrawerProps> = ({ isOpen, onClose, comments, onLikeComment }) => {
    const [newComment, setNewComment] = useState('')

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }
        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [isOpen])

    const handleSubmitComment = (e: React.FormEvent) => {
        e.preventDefault()
        // Here you would typically send the comment to your backend
        console.log('New comment:', newComment)
        setNewComment('')
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    animate={{ opacity: 1 }}
                    className="fixed inset-0 bg-black bg-opacity-50 md:z-[90000000000000]"
                    exit={{ opacity: 0 }}
                    initial={{ opacity: 0 }}
                    onClick={onClose}
                >
                    <motion.div
                        animate={{ x: 0 }}
                        className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-white dark:bg-black shadow-lg"
                        exit={{ x: '100%' }}
                        initial={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-center p-4 border-b">
                            <h2 className="text-xl font-semibold">Responses ({comments.length})</h2>
                            <Button isIconOnly variant="light" onPress={onClose}>
                                <X size={24} />
                            </Button>
                        </div>
                        <div className="p-4 overflow-y-auto h-[calc(100%-70px)]">
                            <form className="mb-6" onSubmit={handleSubmitComment}>
                                <Textarea
                                    className="mb-2"
                                    placeholder="What are your thoughts?"
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                />
                                <Button color="primary" type="submit">Respond</Button>
                            </form>
                            <div className="space-y-4">
                                {comments.map((comment, index) => (
                                    <motion.div
                                        key={index}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="flex space-x-3"
                                        initial={{ opacity: 0, y: 20 }}
                                        transition={{ delay: index * 0.1 }}
                                    >
                                        <Avatar name={comment.author} src={comment.avatar} />
                                        <div className="flex-grow">
                                            <p className="font-semibold">{comment.author}</p>
                                            <p className="text-sm text-gray-500">{comment.date}</p>
                                            <p className="mt-1">{comment.content}</p>
                                            <Button
                                                className={`mt-2 p-0 ${comment.liked ? 'text-danger' : 'text-gray-500'}`}
                                                size="sm"
                                                startContent={<Heart className={`w-4 h-4 ${comment.liked ? 'fill-current text-danger' : ''}`} />}
                                                variant="light"
                                                onPress={() => onLikeComment(index)}
                                            >
                                                {comment.likes}
                                            </Button>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

const BlogDetails: React.FC = () => {
    const [isCommentDrawerOpen, setIsCommentDrawerOpen] = useState(false)
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
        <div className="max-w-4xl mx-auto px-4 py-8">
            <motion.div
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
                initial={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="text-4xl font-bold mb-4">Exploring GraphQL with Express: A Beginner's Guide</h1>
                <div className="flex items-center space-x-4 mb-4">
                    <Avatar name="Tomas Svojanovsky" src="/placeholder.svg?height=40&width=40" />
                    <div>
                        <p className="font-semibold">Tomas Svojanovsky</p>
                        <p className="text-sm text-gray-500">Published in JavaScript in Plain English · 5 min read · 1 day ago</p>
                    </div>
                </div>
                <div className="hidden md:flex items-center space-x-4 text-gray-500">
                    <Button size="sm" startContent={<Heart className="w-5 h-5" />} variant="light">
                        13
                    </Button>
                    <Button size="sm" startContent={<MessageCircle className="w-5 h-5" />} variant="light" onPress={() => setIsCommentDrawerOpen(true)}>
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
                    alt="Featured Image"
                    className="w-full h-auto mb-8 rounded-lg"
                    height={400}
                    src="/placeholder.svg?height=400&width=800"
                    width={800}
                />
            </motion.div>

            <motion.div
                animate={{ opacity: 1 }}
                className="prose max-w-none"
                initial={{ opacity: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
            >
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </p>
                <h2>Getting Started with GraphQL</h2>
                <p>
                    Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                </p>
                {/* Add more content as needed */}
            </motion.div>

            <Card
                isBlurred
                className="fixed bottom-0 left-0 right-0 bg-background/60 dark:bg-default-100/50 z-[100]"
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
                                <Bookmark className="w-6 h-6" />
                            </Button>
                            <Button isIconOnly size="sm" variant="light">
                                <Share2 className="w-6 h-6" />
                            </Button>
                        </div>
                    </div>
                </CardBody>
            </Card>

            <CommentDrawer
                comments={comments}
                isOpen={isCommentDrawerOpen}
                onClose={() => setIsCommentDrawerOpen(false)}
                onLikeComment={handleLikeComment}
            />
        </div>
    )
}

export default BlogDetails