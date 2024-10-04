import { Avatar, Card, CardBody, Chip } from "@nextui-org/react";
import Image from "next/image";

import { IArticleResponse } from "@/interface/articles.response.interface";
import calculateReadTime from "@/utils/calculate_read_time";
import { topicsData } from "@/const/article/topics";

export const ArticlePreview = ({ data }: { data: IArticleResponse }) => (
    <Card className="mb-6 border-b border-gray-200 pb-6">
        <CardBody>
            <div className="flex items-center mb-2">
                <Avatar className="mr-2" size="sm" src={data?.author?.profileImg} />
                <span className="text-small font-medium">{data?.author?.name}</span>
            </div>
            <div className="flex flex-col md:flex-row justify-between">
                <div className="flex-grow pr-0 md:pr-4">
                    <h2 className="text-xl font-bold mb-2">{data?.title}</h2>
                    {/* <p className="text-default-500 mb-4">{snippet}</p> */}
                    <div className="flex flex-wrap items-center gap-2 mb-4">
                        <span className="text-small text-default-400">10/323/3232</span>
                        <span className="text-small text-default-400">{calculateReadTime(data.description)} min read</span>
                        {data.topics.map((tag, index) => (
                            <Chip key={index} size="sm" variant="flat" > {tag}</Chip>
                        ))}
                    </div>
                </div>
                {data.images && (
                    <div className="w-full md:w-60 h-40 md:h-24 mb-4 md:mb-0">
                        <Image alt={data.title} className="w-full h-full object-cover rounded" height={100} src={data.images[0]} width={100} />
                    </div>
                )}
            </div>
        </CardBody>
    </Card >
)