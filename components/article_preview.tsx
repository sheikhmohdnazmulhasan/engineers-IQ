import { Avatar, Card, CardBody, Chip } from "@nextui-org/react";
import Image from "next/image";


export const ArticlePreview = ({ title, author, snippet, date, readTime, image, tags }) => (
    <Card className="mb-6 border-b border-gray-200 pb-6">
        <CardBody>
            <div className="flex items-center mb-2">
                <Avatar className="mr-2" size="sm" src={author.avatar} />
                <span className="text-small font-medium">{author.name}</span>
            </div>
            <div className="flex flex-col md:flex-row justify-between">
                <div className="flex-grow pr-0 md:pr-4">
                    <h2 className="text-xl font-bold mb-2">{title}</h2>
                    <p className="text-default-500 mb-4">{snippet}</p>
                    <div className="flex flex-wrap items-center gap-2 mb-4">
                        <span className="text-small text-default-400">{date}</span>
                        <span className="text-small text-default-400">{readTime} min read</span>
                        {tags.map((tag, index) => (
                            <Chip key={index} size="sm" variant="flat">{tag}</Chip>
                        ))}
                    </div>
                </div>
                {image && (
                    <div className="w-full md:w-96 h-40 md:h-24 mb-4 md:mb-0">
                        <Image alt={title} className="w-full h-full object-cover rounded" height={100} src={image} width={100} />
                    </div>
                )}
            </div>
        </CardBody>
    </Card>
)