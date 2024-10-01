'use client'

import React from 'react';
import { Avatar, Button, Link, User } from "@nextui-org/react";
import { MoreHorizontal } from "lucide-react";

import { ArticlePreview } from '@/components/article_preview';
import UserName from '@/components/premium_acc_badge';

export default function Component() {
    return (
        <div className="container mx-auto max-w-7xl">
            <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Column: Profile Info for mobile, Right for large screens */}
                <div className="lg:order-2 lg:col-span-1 order-1">
                    <Avatar
                        alt="Sheikh Mohammad Nazmul H."
                        className="w-24 h-24 mt-4"
                        src="/placeholder.svg?height=100&width=100"
                    />
                    <UserName isPremium={true} name='Sheikh Mohammad Nazmul H.' />
                    <p className=" text-gray-600">@nazmul</p>
                    <Button className="mt-4" color="primary" size="sm" variant="flat">
                        Edit profile
                    </Button>

                    {/* Following List */}
                    <div className="mt-8">
                        <h3 className="text-xl font-semibold mb-4">Following</h3>
                        {["Ally Sprague", "Shuai Li", "JavaScript in Plain English", "Chayti", "Medium Staff"].map((name, index) => (
                            <div key={index} className="flex items-center justify-between mb-4">
                                <User
                                    avatarProps={{
                                        src: `/placeholder.svg?height=40&width=40&text=${name.charAt(0)}`,
                                        size: "sm",
                                    }}
                                    description={index === 2 ? "Publication" : "Writer"}
                                    name={name}
                                />
                                <Button isIconOnly aria-label="More options" variant="light">
                                    <MoreHorizontal size={16} />
                                </Button>
                            </div>
                        ))}
                        <Link color="primary" href="#">See all (5)</Link>
                    </div>
                </div>

                {/* Right Column: Content for mobile, Left for large screens */}
                <div className="lg:order-1 lg:col-span-2 order-2">
                    <div className="flex flex-col items-start mb-8">
                        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">Sheikh Mohammad Nazmul H.</h1>
                        <div className="flex mt-4 space-x-4">
                            <Link className="font-medium cursor-pointer" color="foreground">Home</Link>
                            <p className='cursor-pointer' color="foreground">Lists</p>
                            <p className='cursor-pointer' color="foreground ">About</p>
                        </div>
                    </div>
                    <ArticlePreview
                        author={{ name: "Alex Mathers", avatar: "/placeholder.svg?height=40&width=40" }}
                        date="2d ago"
                        image="https://plus.unsplash.com/premium_photo-1685086785054-d047cdc0e525?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                        readTime={5}
                        snippet="What even is 'focus'? It's a term we throw around a lot, but do we really understand what it means to be focused? In this article, we'll explore the concept of focus and how to achieve it in your daily life."
                        tags={['Productivity', 'Self Improvement']}
                        title="Nine things you gotta stop doing if you want more focus"
                    />
                </div>
            </main>
        </div>
    );
}
