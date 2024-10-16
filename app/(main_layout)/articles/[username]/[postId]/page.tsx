'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Bookmark, Heart, LockIcon, MessageCircle, Share } from 'lucide-react'
import { Button, Avatar, Card, CardBody, useDisclosure, Modal, ModalContent, ModalHeader, ModalBody } from "@nextui-org/react"
import { motion } from 'framer-motion'
import Link from 'next/link'
import DOMPurify from 'dompurify'
import { toast } from 'sonner'
import html2pdf from 'html2pdf.js'
import { useRef } from 'react'
import { FaClipboard, FaClipboardCheck } from "react-icons/fa";

import useArticle from '@/hooks/use_articles'
import { IArticleResponse, IClap, IComment } from '@/interface/articles.response.interface'
import formatDateReadable from '@/utils/format_date_readable'
import UserName from '@/components/premium_acc_badge'
import useUser from '@/hooks/useUser'
import axiosInstance from '@/libs/axiosInstance'
// eslint-disable-next-line import/order
import Loading from '@/components/loading'

// static img ofr sharing
import facebook from "@/public/share/facebook.png";
import linkedin from "@/public/share/linkedin.png";
import mail from "@/public/share/mail.png";
import wp from "@/public/share/wp.png";
import twitter from "@/public/share/twitter.png";
import { encrypt } from '@/utils/text_encryptor'

import { CommentDrawer } from './CommentDrawer'



export interface Comment {
    author: string
    avatar: string
    date: string
    content: string
    likes: number
    liked: boolean
}

export default function BlogDetails({ params }: { params: { postId: string } }) {
    const { currentUser } = useUser()
    const { data, revalidate, error } = useArticle({ _id: params.postId })
    const article = Array.isArray(data) ? data[0] : data as IArticleResponse | null
    const [isCommentDrawerOpen, setIsCommentDrawerOpen] = useState(false)
    const [newCommentLoading, setNewCommentLoading] = useState<boolean>(false)
    const [lastScrollY, setLastScrollY] = useState(0)
    const contentRef = useRef<HTMLDivElement | null>(null)
    const [loading, setLoading] = useState<boolean>(true)

    const hasClapped = article?.claps.some((clap: IClap) => clap._id === currentUser?._id)
    const isPremiumContent = article?.isPremiumContent
    const isUserLoggedIn = !!currentUser
    const shouldBlurContent = !isUserLoggedIn && isPremiumContent
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [coped, setCoped] = useState(false);

    async function handleClapped() {
        if (!currentUser) {
            toast.error('You are not logged in', {
                position: 'bottom-left'
            })
            return
        }
        try {
            setNewCommentLoading(true)
            await axiosInstance.patch('/articles/clap', {
                articleId: article?._id,
                user: encrypt(currentUser?._id)
            })
            revalidate()
            setNewCommentLoading(false)
        } catch (error) {
            setNewCommentLoading(false)
            toast.error('Something Bad Happened!')
        }
    }

    const handleDownload = () => {
        const element = contentRef.current
        if (!element) return

        const options = {
            margin: 1,
            filename: `${article?.title}-offline-engineersiq.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: {
                scale: 2,
                backgroundColor: '#000',
                useCORS: true
            },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        }

        html2pdf().from(element).set(options).save()
    };

    // copy link
    function handleCopyLink() {
        const url = window.location.href;
        navigator.clipboard.writeText(url);
        setCoped(true);

        setTimeout(() => {
            setCoped(false);
        }, 1000);
    }

    function handleSocialShare(media: string) {
        if (media === "facebook") {
            const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                window.location.href
            )}`;
            window.open(url, "_blank", "width=700,height=500");

        } else if (media === "mail") {
            const subject = `Check out ${article?.title}`;
            const body = `I thought you might be interested in this article: ${window.location.href}`;
            const mailtoUrl = `mailto:?subject=${encodeURIComponent(
                subject
            )}&body=${encodeURIComponent(body)}`;
            window.location.href = mailtoUrl;

        } else if (media === "linkedin") {
            const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                window.location.href
            )}`;
            window.open(url, "_blank");

        } else if (media === "twitter") {
            const text = `Check out ${article?.title}`;
            const url = encodeURIComponent(window.location.href);
            const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
                text
            )}&url=${url}`;
            window.open(twitterUrl, "_blank", "width=600,height=400");

        } else if (media === "whatsapp") {
            const text = `Check out ${article?.title}` + " " + window.location.href;
            const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
            window.open(whatsappUrl, "_blank");
        }
    }

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY
            setLastScrollY(Math.floor(currentScrollY))
        }

        window.addEventListener('scroll', handleScroll, { passive: true })

        return () => window.removeEventListener('scroll', handleScroll)
    }, [lastScrollY])

    useEffect(() => {
        setTimeout(() => {
            setLoading(false)
        }, 1500)
    }, [])

    return (
        <>
            {loading && <Loading />}
            {!!error && (
                <div className="text-center flex justify-center items-center h-screen w-full -mt-32">
                    <p>Article Not Found</p>
                </div>
            )}

            {!error && shouldBlurContent && (
                <div className="inset-0 flex items-center h-screen -mt-32 justify-center">
                    <div className="text-center">
                        <LockIcon className="w-12 h-12 text-[#1877F2] mb-4 mx-auto" />
                        <Link href={`/auth/login?redirect=${`/articles/${article?.author?.username}/${article?._id}`}`}>
                            <Button color="primary" variant="bordered">
                                Login to Read Exclusive Content
                            </Button>
                        </Link>
                    </div>
                </div>
            )}

            {!error && !shouldBlurContent && (
                <>


                    <Modal
                        backdrop='blur'
                        isOpen={isOpen}
                        placement="auto"
                        size='lg'
                        onOpenChange={onOpenChange}
                    >
                        <ModalContent >
                            <>
                                <ModalHeader className="flex flex-col gap-1">Share <span className='text-sm font-light'>{article?.title}</span> </ModalHeader>
                                <ModalBody>
                                    <div className="flex gap-4 justify-center items-center mt-8">
                                        <Image
                                            alt="Facebook icon"
                                            className="w-10 transition-all hover:scale-110 hover:cursor-pointer"
                                            quality={100}
                                            src={facebook}
                                            onClick={() => handleSocialShare("facebook")}
                                        />
                                        <Image
                                            alt="Email icon"
                                            className="w-10 transition-all hover:scale-110 hover:cursor-pointer"
                                            quality={100}
                                            src={mail}
                                            onClick={() => handleSocialShare("mail")}
                                        />
                                        <Image
                                            alt="Linkedin icon"
                                            className="w-10 transition-all hover:scale-110 hover:cursor-pointer"
                                            quality={100}
                                            src={linkedin}
                                            onClick={() => handleSocialShare("linkedin")}
                                        />
                                        <Image
                                            alt="twitter icon"
                                            className="w-10 transition-all hover:scale-110 hover:cursor-pointer"
                                            quality={100}
                                            src={twitter}
                                            onClick={() => handleSocialShare("twitter")}
                                        />
                                        <Image
                                            alt="wp icon"
                                            className="w-10 transition-all hover:scale-110 hover:cursor-pointer"
                                            quality={100}
                                            src={wp}
                                            onClick={() => handleSocialShare("whatsapp")}
                                        />
                                    </div>
                                    <div className="mt-7 mb-2 flex justify-center items-center ">
                                        <Button
                                            color='primary'
                                            variant='bordered'
                                            onClick={handleCopyLink}
                                        >
                                            Copy Link{" "}
                                            {!coped ? (
                                                <FaClipboard size={20} />
                                            ) : (
                                                <FaClipboardCheck size={20} />
                                            )}{" "}
                                        </Button>
                                    </div>
                                </ModalBody>
                            </>
                        </ModalContent>
                    </Modal>

                    <div ref={contentRef} className="mx-auto relative" id="content">
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
                            <div className="flex items-center space-x-4 text-gray-500">
                                <Button
                                    className={`mt-2 p-0 ${hasClapped ? 'text-danger' : ''}`}
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

                                <Button size="sm" variant="light" onPress={() => onOpen()}>
                                    <Share className="w-5 h-5" />
                                </Button>

                                <Button size="sm" startContent={<Bookmark className="w-5 h-5" />} variant="light" onPress={handleDownload} />
                            </div>
                        </motion.div>

                        <motion.div
                            animate={{ opacity: 1, scale: 1 }}
                            initial={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.5 }}
                        >
                            <Image
                                alt={article?.title as string}
                                className="w-full h-60 md:h-[500px] object-cover mb-8 rounded-lg"
                                height={300}
                                src={article?.images[0] as string}
                                width={700}
                            />
                        </motion.div>

                        <motion.div
                            animate={{ opacity: 1 }}
                            className={`prose max-w-none`}
                            initial={{ opacity: 0 }}
                            transition={{ delay: 0.2, duration: 0.5 }}
                        >
                            <div className="article-content">
                                <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(article?.description as string) }} />
                            </div>
                        </motion.div>

                        <Card
                            isBlurred
                            className={`fixed bottom-1 left-1 right-1 md:left-16 md:right-16 bg-background/60 dark:bg-default-100/50 z-[100] transition-opacity duration-300 ${lastScrollY > 350 ? 'opacity-100' : 'opacity-0 pointer-events-none'
                                }`}
                            shadow="sm"
                        >
                            <CardBody>
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center space-x-4">
                                        <Button
                                            className={`mt-2 p-0 ${hasClapped ? 'text-danger' : ''}`}
                                            isLoading={newCommentLoading}
                                            size="sm"
                                            startContent={<Heart className={`w-6 h-6 ${hasClapped ? 'fill-current text-danger' : ''}`} />}
                                            variant="light"
                                            onPress={handleClapped}
                                        >
                                            {article?.claps.length}
                                        </Button>

                                        <Button size="sm" startContent={<MessageCircle className="w-6 h-6" />} variant="light" onPress={() => setIsCommentDrawerOpen(!isCommentDrawerOpen)}>
                                            {article?.comments.length}
                                        </Button>
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        <Button size="sm" startContent={<Bookmark className="w-6 h-6" />} variant="light" onPress={handleDownload} />
                                        <Button isIconOnly size="sm" variant="light" onPress={() => onOpen()}>
                                            <Share className="w-6 h-6" />
                                        </Button>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>

                        <CommentDrawer
                            articleId={params.postId}
                            author={article?.author._id as string}
                            comments={article?.comments as IComment[]}
                            isOpen={isCommentDrawerOpen}
                            revalidate={revalidate}
                            onClose={() => setIsCommentDrawerOpen(false)}
                        />
                    </div>
                </>
            )}
        </>
    )
}