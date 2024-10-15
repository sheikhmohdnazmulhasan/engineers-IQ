import { Avatar, Card, CardBody, CardFooter, Chip, Button, ModalBody, ModalContent, Modal, useDisclosure, Spinner } from "@nextui-org/react"
import Image from "next/image"
import Link from "next/link"
import { LockIcon, XCircle } from "lucide-react"
import { AlertTriangle, CheckCircle } from 'lucide-react';
import { useState } from "react";

import { IArticleResponse } from "@/interface/articles.response.interface"
import calculateReadTime from "@/utils/calculate_read_time"
import formatDateReadable from "@/utils/format_date_readable"
import useUser from "@/hooks/useUser"
import axiosInstance from "@/libs/axiosInstance";
import { encrypt } from "@/utils/text_encryptor";

import UserName from "./premium_acc_badge"

export const ArticlePreview = ({
    data,
    fromProfile = false,
    revalidate
}: {
    data: IArticleResponse;
    fromProfile?: boolean;
    revalidate?: () => void;
}) => {
    const { currentUser } = useUser();
    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
    const [deletionState, setDeletionState] = useState<'danger' | 'loading' | 'success' | 'error'>('danger')

    async function handleDeleteArticle() {
        setDeletionState('danger');
        const token = encrypt(data._id);

        try {
            setDeletionState('loading');
            const res = await axiosInstance.delete(`/articles`, {
                params: {
                    token
                }
            });

            if (res.status === 200) {
                setDeletionState('success');
                (revalidate || (() => ({})))();

                setTimeout(() => {
                    onClose();
                    setDeletionState('danger')
                }, 1000);

            } else {
                setDeletionState('error');

                setTimeout(() => {
                    setDeletionState('danger')
                    onClose();
                }, 1500);
            }

        } catch (error) {
            setDeletionState('error');
            setTimeout(() => {
                setDeletionState('danger')
                onClose();
            }, 1500);
        }
    }

    return (

        <>
            <Modal
                backdrop='blur'
                isOpen={isOpen}
                placement="auto"
                size='sm'
                onOpenChange={onOpenChange}
            >
                <ModalContent >
                    <>

                        <ModalBody>
                            <div className="flex flex-col py-4 items-center justify-center space-y-4">
                                {
                                    deletionState === 'danger' ? (
                                        <AlertTriangle color="red" size={60} />

                                    ) : deletionState === 'loading' ? (
                                        <Spinner size="lg" />
                                    ) : deletionState === 'success' ? (
                                        <CheckCircle color="green" size={55} />
                                    ) : (
                                        <XCircle color="red" size={50} />
                                    )
                                }
                                <h6 className="text-center text-sm font-medium opacity-70">
                                    {
                                        deletionState === 'danger' ? 'If you delete your article once, all data related to this article will be permanently deleted and can never be recovered!' : deletionState === 'loading' ? 'Article is being deleted. Please wait' : deletionState === 'success' ? 'Article has been completely deleted from the database' : 'Something Bad Happened. Try again!'
                                    }
                                </h6>
                                <div className=''>

                                    <Button className="px-10" color="danger" variant="flat" onPress={handleDeleteArticle}>Delete</Button>
                                </div>
                            </div>
                        </ModalBody>
                    </>
                </ModalContent>
            </Modal>

            < Card className="mb-6 px-2 relative overflow-hidden" >
                <CardBody className={data.isPremiumContent && !currentUser ? "blur-sm" : ""}>
                    <Link className="flex items-center mb-2 hover:underline" href={`/profile/${data.author.username}`}>
                        <Avatar className="mr-2" size="sm" src={data?.author?.profileImg} />
                        <UserName isPremium={data.author.isPremiumMember} name={data?.author?.name} />
                    </Link>
                    <Link href={`/articles/${data.author.username}/${data._id}`}>
                        <div className="flex flex-col md:flex-row justify-between">
                            <div className="flex-grow pr-0 md:pr-4">
                                <h2 className="text-xl font-bold mb-2">{data?.title}</h2>
                                <p className="text-default-500 mb-4">{data?.textArea}</p>
                                <div className="flex flex-wrap text-default-400 items-center gap-2 mb-4">
                                    <span className="text-small">{formatDateReadable(data.createdAt)}</span>
                                    ·
                                    <span className="text-small ">{calculateReadTime(data.description)} min read</span>
                                    ·
                                    <span className="text-small ">{data.views} views</span>
                                    {data.topics.map((tag, index) => (
                                        <Chip key={index} size="sm" variant="flat">
                                            {tag}
                                        </Chip>
                                    ))}
                                </div>
                            </div>
                            {data.images && (
                                <div className="w-full md:w-80 h-40 md:h-24 mb-4 md:mb-0">
                                    <Image
                                        alt={data.title}
                                        className="w-full h-full object-cover rounded"
                                        height={100}
                                        src={data.images[0]}
                                        width={100}
                                    />
                                </div>
                            )}
                        </div>
                    </Link>
                </CardBody>

                {
                    fromProfile && currentUser?._id === data.author._id && (
                        <CardFooter className="">
                            <div className="flex gap-4">
                                <Link href={`/articles/edit/${data.author.username}/${data._id}`}><Chip className="">Edit</Chip></Link>
                                <Chip className="hover:cursor-pointer" color="danger" onClick={onOpen}>Delete</Chip>
                            </div>
                        </CardFooter>
                    )
                }

                {
                    data.isPremiumContent && !currentUser && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                            <div className="text-center">
                                <LockIcon className="w-12 h-12 text-[#1877F2] mb-4 mx-auto" />
                                <Link href={!fromProfile ? `/auth/login` : `/auth/login?redirect=/profile/${data.author.username}`}> <Button color="primary" variant="bordered">
                                    Login And Read
                                </Button></Link>
                            </div>
                        </div>
                    )
                }
            </ Card>
        </>
    )
}