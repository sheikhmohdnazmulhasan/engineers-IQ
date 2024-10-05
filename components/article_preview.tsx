import { Avatar, Card, CardBody, CardFooter, Chip, Button } from "@nextui-org/react"
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

    return (
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
                            <Chip color="danger">Delete</Chip>
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
    )
}