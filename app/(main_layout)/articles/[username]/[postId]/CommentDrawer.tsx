import { useState, useEffect } from 'react'
import { Heart, X, } from 'lucide-react'
import { Button, Textarea, Avatar, } from "@nextui-org/react"
import { AnimatePresence, motion, } from 'framer-motion'
import { toast } from 'sonner'

import { IClap, IComment } from '@/interface/articles.response.interface'
import UserName from '@/components/premium_acc_badge'
import formatDateReadable from '@/utils/format_date_readable'
import useUser from '@/hooks/useUser'
import axiosInstance from '@/libs/axiosInstance'

interface CommentDrawerProps {
    isOpen: boolean
    onClose: () => void
    comments: IComment[]
    articleId: string
    onLikeComment: (index: string) => void
    revalidate: () => void
}

export const CommentDrawer: React.FC<CommentDrawerProps> = ({ isOpen, onClose, comments, onLikeComment, articleId, revalidate }) => {
    const { currentUser } = useUser();
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState<boolean>(false);

    const hasClapped = comments?.some((comment: IComment) =>
        comment.claps.some((clap: IClap) => clap._id === currentUser?._id)
    );

    const handleSubmitComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentUser) {
            toast.error('You are not logged in', {
                position: 'bottom-left'
            });
        };

        try {
            setLoading(true);
            await axiosInstance.put(`articles/comment?ref=${articleId}`, {
                user: currentUser?._id,
                content: newComment,
            });

            revalidate();
            setLoading(false);
            setNewComment('');
        } catch (error) {
            toast.error('Something Bad Happened', {
                position: 'bottom-left'
            });;
            setLoading(false);
        }
    }

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
                                    required
                                    className="mb-2"
                                    placeholder="What are your thoughts?"
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                />
                                <Button color="primary" isLoading={loading} type="submit" variant='bordered'>Respond</Button>
                            </form>
                            <div className="space-y-4">
                                {comments.slice().reverse().map((comment, index) => (
                                    <motion.div
                                        key={index}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="flex space-x-3"
                                        initial={{ opacity: 0, y: 20 }}
                                        transition={{ delay: index * 0.1 }}
                                    >
                                        <Avatar name={comment.user.name} src={comment.user.profileImg} />
                                        <div className="flex-grow">
                                            <UserName isPremium={comment.user.isPremiumMember} name={comment.user.name} />
                                            {/* <p className="font-semibold">{comment.user.name}</p> */}
                                            <p className="text-sm text-gray-500">{formatDateReadable(comment.createdAt)}</p>
                                            <p className="mt-1">{comment.content}</p>
                                            <Button
                                                className={`mt-2 p-0 ${hasClapped ? 'text-danger' : 'text-gray-500'}`}
                                                size="sm"
                                                startContent={<Heart className={`w-4 h-4 ${hasClapped ? 'fill-current text-danger' : ''}`} />}
                                                variant="light"
                                                onPress={() => onLikeComment(comment._id)}
                                            >
                                                {comment.claps.length}
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