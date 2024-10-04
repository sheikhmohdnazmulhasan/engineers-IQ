import { Avatar, Button, Card, CardBody, CardFooter, Chip, Tooltip } from "@nextui-org/react";
import Image from "next/image";
import Link from "next/link";

import { IArticleResponse } from "@/interface/articles.response.interface";
import calculateReadTime from "@/utils/calculate_read_time";
import formatDateReadable from "@/utils/format_date_readable";

import UserName from "./premium_acc_badge";


export const ArticlePreview = ({ data, fromProfile = false }: { data: IArticleResponse, fromProfile?: boolean }) => (
    <Card className="mb-6 ">
        <CardBody>
            <Link className="flex items-center mb-2 hover:underline" href={`/profile/${data.author.username}`}>
                <Avatar className="mr-2" size="sm" src={data?.author?.profileImg} />
                <UserName isPremium={data.author.isPremiumMember} name={data?.author?.name} />
            </Link>
            <div className="flex flex-col md:flex-row justify-between">
                <div className="flex-grow pr-0 md:pr-4">
                    <h2 className="text-xl font-bold mb-2">{data?.title}</h2>
                    <p className="text-default-500 mb-4">Lorem ipsum dolor sit amet consectetur adipisicing elit. Iste ab, minima, praesentium quibusdam voluptatum omnis autem repellat, error odit laborum maiores cum ullam vero tempore. Autem obcaecati illum quidem maiores!</p>
                    <div className="flex flex-wrap items-center gap-2 mb-4">
                        <span className="text-small text-default-400">{formatDateReadable(data.createdAt)}</span>
                        <span className="text-small text-default-400">{calculateReadTime(data.description)} min read</span>
                        {data.topics.map((tag, index) => (
                            <Chip key={index} size="sm" variant="flat" > {tag}</Chip>
                        ))}
                    </div>
                </div>
                {data.images && (
                    <div className="w-full md:w-80 h-40 md:h-24 mb-4 md:mb-0">
                        <Image alt={data.title} className="w-full h-full object-cover rounded" height={100} src={data.images[0]} width={100} />
                    </div>
                )}


            </div>
        </CardBody>

        {fromProfile && <CardFooter className="">
            <div className="flex gap-4">
                <Chip className="">Edit </Chip>
                <Chip color="danger">Delete</Chip>
            </div>
        </CardFooter>}


    </Card >
)