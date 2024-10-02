'use client'

import React, { useEffect, useState } from 'react';
import { Avatar, Button, Link } from "@nextui-org/react";
import { MoreHorizontal } from "lucide-react";
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { FaPen } from "react-icons/fa6";
import { IoMdSave } from "react-icons/io";

import { ArticlePreview } from '@/components/article_preview';
import UserName from '@/components/premium_acc_badge';
import useProfile from '@/hooks/use_profile';
import useUser from '@/hooks/useUser';
import Loading from '@/components/loading';
import { IfollowersAndFollowing, IUserResponse } from '@/interface/user.response.interface';
import axiosInstance from '@/libs/axiosInstance';
import { INotificationEmail } from '@/interface/email.notification.interface';
import sendNotificationEmail from '@/utils/send_notification_email';

export default function Profile({ params }: { params: { user: string } }) {
    const [isWonProfile, setIsWonProfile] = useState<boolean>(false);
    const { profile, error, isLoading, revalidate } = useProfile(params.user);
    const { currentUser, isLoading: userLoading } = useUser();
    const [flowFlngDisplay, setFlowFlngDisplay] = useState<number>(5);
    const isAlreadyFollowed = profile?.followers.find(xx => xx._id === currentUser?._id);
    const [isActionLoading, setIsActionLoading] = useState<boolean>(false);
    const [nameChangedAction, setNameChangedAction] = useState<boolean>(false);
    const [updatedName, setUpdatedName] = useState<string>('');

    const router = useRouter();

    async function handleFollowNewPerson(target: IUserResponse) {
        setIsActionLoading(true);

        if (!currentUser) {
            setIsActionLoading(false);
            router.push(`/auth/login?redirect=/profile/${params.user}`);
            return
        }

        const payload = {
            follower: currentUser?._id,
            following: target._id
        }

        try {
            const serverRes = await axiosInstance.patch('/follow', payload);

            if (serverRes.status === 200) {

                if (currentUser?.isEmailVerified) {
                    const notificationEmailTempForUser: INotificationEmail = {
                        subject: "You've Followed Someone!",
                        receiver_name: currentUser?.name as string,
                        description: `
        You are now following ${target.name}! 🎉

        Stay tuned for their latest updates and posts. Don't miss out on their insights and content. 
        If you want to manage your follow list or check out other users, visit your profile.

        Happy reading!
    `,
                        receiver_email: currentUser?.email as string,
                    };

                    await sendNotificationEmail(notificationEmailTempForUser);
                }

                if (target?.isEmailVerified) {
                    const notificationEmailTempForTarget: INotificationEmail = {
                        subject: "You Have a New Follower!",
                        receiver_name: target.name as string,
                        description: `
        Great news! ${currentUser?.name} has just followed you. 🎉

        They’re excited to see what you’ll be posting next. Keep sharing your amazing content and engage with your followers.

        You can check out their profile or manage your followers by visiting your profile page.

        Keep up the great work!
    `,
                        receiver_email: target.email as string,
                    };

                    await sendNotificationEmail(notificationEmailTempForTarget);

                };

                revalidate();
                toast.success('Following');
                setIsActionLoading(false)
            }

        } catch (error) {
            toast.error('Something Went Wrong!');
            revalidate();
            setIsActionLoading(false)
        }
    };

    async function handleUnfollow(target: string) {
        setIsActionLoading(true);

        const payload = {
            follower: currentUser?._id as string,
            following: target
        };

        try {
            const res = await axiosInstance.put('/follow', payload);

            if (res.status === 200) {
                revalidate();
                toast.success('Unfollowed');
                setIsActionLoading(false)
            }
        } catch (error) {
            revalidate();
            toast.error('Something Bad Happened!');
            setIsActionLoading(false);
        }
    };

    async function handleNameChange() {
        if (!updatedName) {
            setNameChangedAction(false);
            return
        }

        console.log(updatedName);
    }


    useEffect(() => {
        if (currentUser?.username === params.user) {
            setIsWonProfile(true);
        };
    }, [userLoading]);

    return (
        <>
            {isLoading && userLoading && <Loading />}
            {!isLoading && !!error && (
                <div className="text-center mt-20">
                    <p>User Not Found</p>
                </div>
            )}

            {!error && (
                <div className="container mx-auto max-w-7xl">
                    <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                        {/* Left Column: Profile Info for mobile, Right for large screens */}
                        <div className="lg:order-2 lg:col-span-1 order-1">
                            <Avatar
                                alt={profile?.name}
                                className="w-24 h-24 mb-3 mt-4"
                                src={profile?.profileImg}
                            />
                            <div className="flex gap-3 items-center">
                                {nameChangedAction ?
                                    <input className='border rounded-md py-1 px-2' defaultValue={profile?.name} type="text" onChange={(e) => setUpdatedName(e.target.value)} />
                                    : <UserName isPremium={!profile?.isPremiumMember} name={profile?.name} />}

                                {isWonProfile && !nameChangedAction && <FaPen className='cursor-pointer hover:transition-all hover:scale-105 hover:text-sky-600' size={13} onClick={() => setNameChangedAction(true)} />}
                                {isWonProfile && nameChangedAction && <IoMdSave className='cursor-pointer hover:transition-all hover:scale-105 hover:text-sky-600' size={20} onClick={handleNameChange} />}
                            </div>
                            <p className=" text-gray-600">@{profile?.username}</p>

                            {isWonProfile ? <Button className="mt-4" color="primary" size="sm" variant="flat">
                                Edit profile
                            </Button> :
                                isAlreadyFollowed ?
                                    <Button className="mt-4" color="primary" isLoading={isActionLoading} size="sm" variant="flat" onClick={() => handleUnfollow(profile?._id as string)}>
                                        Unfollow
                                    </Button>
                                    : <Button className="mt-4" color="primary" isLoading={isActionLoading} size="sm" variant="flat" onClick={() => handleFollowNewPerson(profile as IUserResponse)}>
                                        Follow
                                    </Button>}

                            {/* Following List */}
                            {isWonProfile ? (
                                <div className="mt-8">
                                    <div className="">
                                        <h3 className="text-xl font-semibold mb-4">Following</h3>
                                        {profile?.following?.slice(0, flowFlngDisplay)?.reverse()?.map((following: IfollowersAndFollowing, indx) => (
                                            <div key={indx} className="flex items-center justify-between mb-4">
                                                <div className="flex items-center gap-2">
                                                    <Avatar size='sm' src={following.profileImg} />
                                                    <div className="text-sm">
                                                        <UserName isPremium={following?.isPremiumMember} name={following?.name} />
                                                        <p className=" text-gray-600 text-sm">@{following?.username}</p>
                                                    </div>
                                                </div>

                                                <Button isIconOnly aria-label="More options" variant="light">
                                                    <MoreHorizontal size={16} />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                    {profile?.following && profile?.following?.length > 5 && (
                                        <button
                                            className='text-sky-600'
                                            onClick={() => setFlowFlngDisplay(flowFlngDisplay > 5 ? 5 : profile.following.length)}>
                                            {flowFlngDisplay > 5 ? 'See less'
                                                : `See all (${profile.following.length + 1})`}
                                        </button>
                                    )}
                                </div>
                            ) : (
                                // followers list
                                <div className="mt-8">
                                    <div className="">
                                        <h3 className="text-xl font-semibold mb-4">Followers</h3>
                                        {profile?.followers?.slice(0, flowFlngDisplay)?.reverse()?.map((follower: IfollowersAndFollowing, indx) => (
                                            <div key={indx} className="flex items-center justify-between mb-4">
                                                <div className="flex items-center gap-2">
                                                    <Avatar size='sm' src={follower.profileImg} />
                                                    <div className="text-sm">
                                                        <UserName isPremium={follower?.isPremiumMember} name={follower?.name} />
                                                        <p className=" text-gray-600 text-sm">@{follower?.username}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    {profile?.followers && profile?.followers?.length > 5 && (
                                        <button
                                            className='text-sky-600'
                                            onClick={() => setFlowFlngDisplay(flowFlngDisplay > 5 ? 5 : profile.followers.length)}>
                                            {flowFlngDisplay > 5 ? 'See less'
                                                : `See all (${profile.followers.length + 1})`}
                                        </button>
                                    )}
                                </div>
                            )}
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
            )}
        </>
    );
}
