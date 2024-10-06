import { Avatar, Card, CardBody, CardFooter, Chip, Button, ModalBody, ModalContent, Modal, useDisclosure } from "@nextui-org/react"
import Image from "next/image"
import Link from "next/link"
import { LockIcon } from "lucide-react"

import { IArticleResponse } from "@/interface/articles.response.interface"
import calculateReadTime from "@/utils/calculate_read_time"
import formatDateReadable from "@/utils/format_date_readable"
import useUser from "@/hooks/useUser"

import UserName from "./premium_acc_badge"

export const ArticlePreview = ({ data, fromProfile = false }: { data: IArticleResponse; fromProfile?: boolean }) => {
    const { currentUser } = useUser();
    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();


    async function handleDeleteArticle(_id: string) {


    }

    return (

        <>

            {/* deleting modal */}

            <Modal
                backdrop='blur'
                isOpen={isOpen}
                placement="auto"
                size='sm'
                onOpenChange={onOpenChange}
            >
                <ModalContent >
                    <>
                        {/* <ModalHeader className="flex flex-col gap-1">Change Password</ModalHeader> */}
                        <ModalBody>
                            <div className="flex flex-col py-4 items-center justify-center space-y-4">
                                <svg className="w-16 stroke-rose-600" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g strokeWidth="0" /><g strokeLinecap="round" strokeLinejoin="round" /><g><path d="M12 7.75V13" opacity="0.4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" /><path d="M21.0802 8.58003V15.42C21.0802 16.54 20.4802 17.58 19.5102 18.15L13.5702 21.58C12.6002 22.14 11.4002 22.14 10.4202 21.58L4.48016 18.15C3.51016 17.59 2.91016 16.55 2.91016 15.42V8.58003C2.91016 7.46003 3.51016 6.41999 4.48016 5.84999L10.4202 2.42C11.3902 1.86 12.5902 1.86 13.5702 2.42L19.5102 5.84999C20.4802 6.41999 21.0802 7.45003 21.0802 8.58003Z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" /><path d="M12 16.2002V16.3002" opacity="0.4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></g></svg>
                                <h6 className="text-center text-sm font-medium opacity-70">If you delete your article once, all data related to this article will be permanently deleted and can never be recovered!</h6>
                                <div className=''>

                                    <Button color="danger" className="px-10" variant="flat">Delete</Button>

                                    {/* <button className="rounded-md border border-rose-600 px-6 py-2 text-sm text-rose-600 hover:bg-rose-600 hover:text-white">
                                        Not Now
                                    </button> */}
                                </div>
                            </div>
                        </ModalBody>
                    </>
                </ModalContent>
            </Modal>

            < Card className="mb-6 px-2 relative overflow-hidden" >
                <CardBody className={data.isPremiumContent && !currentUser?.isPremiumMember ? "blur-sm" : ""}>
                    <Link className="flex items-center mb-2 hover:underline" href={`/profile/${data.author.username}`}>
                        <Avatar className="mr-2" size="sm" src={data?.author?.profileImg} />
                        <UserName isPremium={data.author.isPremiumMember} name={data?.author?.name} />
                    </Link>
                    <Link href={`/articles/${data.author.username}/${data._id}`}>
                        <div className="flex flex-col md:flex-row justify-between">
                            <div className="flex-grow pr-0 md:pr-4">
                                <h2 className="text-xl font-bold mb-2">{data?.title}</h2>
                                <p className="text-default-500 mb-4">{data?.textArea}</p>
                                <div className="flex flex-wrap items-center gap-2 mb-4">
                                    <span className="text-small text-default-400">{formatDateReadable(data.createdAt)}</span>
                                    <span className="text-small text-default-400">{calculateReadTime(data.description)} min read</span>
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
                                <Chip className="">Edit </Chip>
                                <Chip className="hover:cursor-pointer" color="danger" onClick={onOpen}>Delete</Chip>
                            </div>
                        </CardFooter>
                    )
                }

                {
                    data.isPremiumContent && !currentUser?.isPremiumMember && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                            <div className="text-center">
                                <LockIcon className="w-12 h-12 text-[#1877F2] mb-4 mx-auto" />
                                <Link href={!currentUser && !fromProfile ? `/auth/login` : currentUser ? '/pricing' : `/auth/login?redirect=/profile/${data.author.username}`}> <Button color="primary" variant="bordered">
                                    {currentUser ? 'Browse Premium Plans' : 'Login And Read'}
                                </Button></Link>
                            </div>
                        </div>
                    )
                }
            </ Card>
        </>
    )
}