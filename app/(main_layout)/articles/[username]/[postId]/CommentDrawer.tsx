import { useState, useEffect } from 'react'
import { Heart, X, Edit, Trash, Save } from 'lucide-react'
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
    revalidate: () => void
}

export const CommentDrawer: React.FC<CommentDrawerProps> = ({ isOpen, onClose, comments, articleId, revalidate }) => {
    const { currentUser } = useUser();
    const [newComment, setNewComment] = useState('');
    const [newCommentLoading, setNewCommentLoading] = useState<boolean>(false);
    const [clapLoading, setClapLoading] = useState<string | null>(null);
    const [commentUpdateAction, setCommentUpdateAction] = useState<number | null>(null);
    const [commentUpdatedContent, setCommentUpdatedContent] = useState<string | null>(null);
    const [commentUpdatedLoading, setCommentUpdatedLoading] = useState<boolean>(false);


    const handleSubmitComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentUser) {
            toast.error('You are not logged in', {
                position: 'bottom-left'
            });
            return;
        };

        try {
            setNewCommentLoading(true);
            await axiosInstance.put(`articles/comment?ref=${articleId}`, {
                user: currentUser?._id,
                content: newComment,
            });

            revalidate();
            setNewCommentLoading(false);
            setNewComment('');
        } catch (error) {
            toast.error('Something Bad Happened', {
                position: 'bottom-left'
            });
            setNewCommentLoading(false);
        }
    };

    const handleLikeComment = async (commentId: string) => {
        if (!currentUser) {
            toast.error('You are not logged in', {
                position: 'bottom-left'
            });
            return
        };

        try {
            setClapLoading(commentId);
            await axiosInstance.patch(`/articles/comment/clap?ref=${articleId}`, {
                commentId,
                userId: currentUser._id
            });
            revalidate();
            setClapLoading(null);

        } catch (error) {
            toast.error('Something Bad Happened!', {
                position: 'bottom-left'
            });
        }
    };

    const handleEditComment = async (commentId: string) => {
        if (!commentUpdatedContent) {
            setCommentUpdateAction(null);
            return;
        }

        try {
            setCommentUpdatedLoading(true);
            await axiosInstance.patch(`/articles/comment?ref=${articleId}`, {
                commentId,
                updatedContent: commentUpdatedContent,
                user: currentUser?._id
            });
            revalidate()
            setCommentUpdatedLoading(false);
            setCommentUpdateAction(null);

        } catch (error) {
            setCommentUpdateAction(null)
            setCommentUpdatedLoading(false);
            toast.error('Something Bad Happened!', {
                position: 'bottom-left'
            });
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
                    className="fixed inset-0 bg-black mb-12 md:mb-0 bg-opacity-50 md:z-[90000000000000]"
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
                                <Button color="primary" isLoading={newCommentLoading} type="submit" variant='bordered'>Respond</Button>
                            </form>
                            <div className="space-y-4">
                                {comments.slice().reverse().map((comment, index) => {
                                    const hasClapped = comment.claps.some((xx: IClap) => xx._id === currentUser?._id);
                                    const hasWonComment = comment.user._id === currentUser?._id

                                    return (
                                        <motion.div
                                            key={index}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="flex space-x-3"
                                            initial={{ opacity: 0, y: 20 }}
                                            transition={{ delay: index * 0.1 }}
                                        >
                                            <Avatar name={comment.user.name} src={comment.user.profileImg} />
                                            <div className="flex-grow text-sm">
                                                <UserName isPremium={comment.user.isPremiumMember} name={comment.user.name} />
                                                {/* <p className="font-semibold">{comment.user.name}</p> */}
                                                <p className="text-sm text-gray-500">{comment.updatedAt ? 'Edited' + ' ' + formatDateReadable(comment.updatedAt) : formatDateReadable(comment.createdAt)}</p>

                                                {commentUpdateAction === index ?
                                                    <input className='border mt-1 border-gray-500 block rounded-md py-1 px-2' defaultValue={comment.content} type="text"
                                                        onChange={(e) => setCommentUpdatedContent(e.target.value)}
                                                    />
                                                    : <p className="mt-1">{comment.content}</p>
                                                }


                                                {!hasWonComment ? <Button className={`mt-2 p-0 ${hasClapped ? 'text-danger' : 'text-gray-500'}`}
                                                    isLoading={clapLoading === comment._id}
                                                    size="sm"
                                                    startContent={<Heart className={`w-4 h-4 ${hasClapped ? 'fill-current text-danger' : ''}`} />}
                                                    variant="light"
                                                    onPress={() => handleLikeComment(comment._id)}
                                                >
                                                    {comment.claps.length}
                                                </Button>
                                                    :

                                                    commentUpdateAction !== index ?
                                                        <>
                                                            <Button
                                                                className={`mt-2 p-0 text-gray-500`}
                                                                size="sm"
                                                                startContent={<Heart className={`w-4 h-4`} />}
                                                                variant="light"
                                                                onPress={() => {
                                                                    toast.error('You cannot applaud your won comments!', {
                                                                        position: 'bottom-left'
                                                                    });
                                                                }}
                                                            >
                                                                {comment.claps.length}
                                                            </Button>

                                                            <Button
                                                                isIconOnly
                                                                className={`mt-2 p-0 text-gray-500`}
                                                                size="sm"
                                                                startContent={<Edit className={`w-4 h-4`} />}
                                                                variant="light"
                                                                onPress={() => setCommentUpdateAction(index)}
                                                            />
                                                            <Button
                                                                isIconOnly
                                                                className={`mt-2 p-0 text-danger`}
                                                                size="sm"
                                                                startContent={<Trash className={`w-4 h-4`} />}
                                                                variant="light"
                                                            // onPress={() => onLikeComment(comment._id)}
                                                            />
                                                        </> :
                                                        <>
                                                            <Button
                                                                isIconOnly
                                                                className={`mt-2 p-0 text-gray-500`}
                                                                isLoading={commentUpdatedLoading}
                                                                size="sm"
                                                                startContent={<Save className={`w-4 h-4`} />}
                                                                variant="light"
                                                                onPress={() => handleEditComment(comment._id)}
                                                            />

                                                            <Button
                                                                isIconOnly
                                                                className={`mt-2 p-0 text-gray-500`}
                                                                size="sm"
                                                                startContent={<X className={`w-4 h-4`} />}
                                                                variant="light"
                                                                onPress={() => setCommentUpdateAction(null)}
                                                            />
                                                        </>
                                                }

                                            </div>
                                        </motion.div>
                                    )
                                })}
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}