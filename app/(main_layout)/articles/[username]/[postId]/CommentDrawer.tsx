import { useState, useEffect } from 'react'
import { Heart, X, } from 'lucide-react'
import { Button, Textarea, Avatar, } from "@nextui-org/react"
import { AnimatePresence, motion, } from 'framer-motion'

import { Comment } from './page'

interface CommentDrawerProps {
    isOpen: boolean
    onClose: () => void
    comments: Comment[]
    onLikeComment: (index: number) => void
}

export const CommentDrawer: React.FC<CommentDrawerProps> = ({ isOpen, onClose, comments, onLikeComment }) => {
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