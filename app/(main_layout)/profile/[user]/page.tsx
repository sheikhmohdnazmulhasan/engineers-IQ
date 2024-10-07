/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
'use client'

import React, { ChangeEvent, useEffect, useState } from 'react';
import { Avatar, Button, Input, Link, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Tooltip, useDisclosure } from "@nextui-org/react";
import { MoreHorizontal } from "lucide-react";
import { toast } from 'sonner';
// import { useRouter } from 'next/navigation';
import { FaPen } from "react-icons/fa6";
import { IoMdSave } from "react-icons/io";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CiCamera } from "react-icons/ci";

import { ArticlePreview } from '@/components/article_preview';
import UserName from '@/components/premium_acc_badge';
import useProfile from '@/hooks/use_profile';
import useUser from '@/hooks/useUser';
import Loading from '@/components/loading';
import { IfollowersAndFollowing, IUserResponse } from '@/interface/user.response.interface';
import axiosInstance from '@/libs/axiosInstance';
import { INotificationEmail } from '@/interface/email.notification.interface';
import sendNotificationEmail from '@/utils/send_notification_email';
import { userPasswordChangeValidationSchema } from '@/validations/user.password_change.validation';
import { encrypt } from '@/utils/text_encryptor';
import uploadImageToImgBb from '@/utils/upload_image_to_imgbb';
import sendAccountVerificationEmail from '@/utils/send_account_verification_email';
import useArticle from '@/hooks/use_articles';
import Pagination from '@/components/pagination';
import { Analytics } from '@/components/profile/analytics';


export default function Profile({ params }: { params: { user: string } }) {
    const [isWonProfile, setIsWonProfile] = useState<boolean>(false);
    const { profile, error, isLoading, revalidate } = useProfile(params.user);
    const { currentUser, isLoading: userLoading, revalidate: userRevalidate } = useUser();
    const [flowFlngDisplay, setFlowFlngDisplay] = useState<number>(5);
    const isAlreadyFollowed = profile?.followers.find(xx => xx._id === currentUser?._id);
    const [isActionLoading, setIsActionLoading] = useState<boolean>(false);
    const [nameChangedAction, setNameChangedAction] = useState<boolean>(false);
    const [updatedName, setUpdatedName] = useState<string>('');
    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
    const [isPassChangeLoading, setIsPassChangeLoading] = useState<boolean>(false);
    const [currentPasswordError, setCurrentPasswordError] = useState<string | null>(null);
    const [render, setRender] = useState<'home' | 'analytics' | 'user' | 'payout'>('home');
    const { data: allArticle, isLoading: allArticleLoading } = useArticle({ author: profile?._id });
    const [currentPage, setCurrentPage] = useState<number>(1);
    const limit = 3
    const totalPages = Math.ceil(Array.isArray(allArticle) ? allArticle.length / limit : 0);

    const { data, revalidate: articleRevalidate } = useArticle({ author: profile?._id, page: currentPage, limit });

    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        resolver: zodResolver(userPasswordChangeValidationSchema)
    });

    // const router = useRouter();

    async function handleFollowNewPerson(target: IUserResponse) {
        setIsActionLoading(true);

        if (!currentUser) {
            setIsActionLoading(false);
            // router.push(`/auth/login?redirect=/profile/${params.user}`);
            toast.error('You are not Logged in!');
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
            return;
        };

        if (updatedName.length > 30) {
            toast.error('Name cannot be more than 30 characters!');
            setNameChangedAction(false);
            setUpdatedName('');
            return;
        }

        const loading = toast.loading('Working...');

        try {
            const res = await axiosInstance.patch(`/users?user=${currentUser?._id}`, { name: updatedName });

            if (res.status == 200) {
                revalidate();
                userRevalidate();
                toast.success('Profile Name Updated', { id: loading });
                setNameChangedAction(false);
                setUpdatedName('');
            };

        } catch (error) {
            toast.error('Something Bad Happened', { id: loading });
            setNameChangedAction(false);
            setUpdatedName('');
        }
    }

    type TFormData = z.infer<typeof userPasswordChangeValidationSchema>
    async function handleChangePassword(data: TFormData) {
        setIsPassChangeLoading(true);
        const auth = encrypt(currentUser?.email as string);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { newPassword2, ...rest } = data;
        const payload = { ...rest, auth };

        try {
            const { data } = await axiosInstance.patch(`/auth/change-password?user=${currentUser?._id}`, payload);

            if (data.success) {
                setIsPassChangeLoading(false);
                onClose();
                reset();
                toast.success(data.message);

            } else if (data.message === 'Current password is incorrect') {
                setIsPassChangeLoading(false);
                reset();
                setCurrentPasswordError(data.message)

            } else {
                setIsPassChangeLoading(false);
                reset();
                onClose();
                toast.error(data.message);
            }

        } catch (error) {
            setIsPassChangeLoading(false);
            reset();
            onClose();
            toast.error('Something Bad Happened!');
        };
    };

    async function handleChangeProfilePicture(event: ChangeEvent<HTMLInputElement>) {
        const loading = toast.loading('Profile Picture Uploading...');

        if (event.target.files && event.target.files[0]) {
            try {
                const imgBbResponse = await uploadImageToImgBb(Array.from(event.target.files));

                if (imgBbResponse.success) {
                    const serverRes = await axiosInstance.patch(`users?user=${currentUser?._id}`, {
                        profileImg: imgBbResponse.urls![0]
                    });

                    if (serverRes.data.success) {
                        toast.success('Profile Picture Updated!', { id: loading });
                        userRevalidate();
                        revalidate();

                    } else {
                        toast.error('Failed to update profile picture (753)', { id: loading })
                    };

                } else {
                    toast.error('Failed to update profile picture (754)', { id: loading });
                }

            } catch (error) {
                toast.error('Something went wrong', { id: loading });
            };
        };

    }

    async function handleResendEmail() {
        const loading = toast.loading('Email Sending...');

        try {
            const emailRes = await sendAccountVerificationEmail({ email: currentUser?.email as string });
            if (emailRes?.status === 200) {
                toast.success('Email Send. Plz Check Your Inbox and Spam Folder', { id: loading });
            } else {
                toast.error('Failed To Resend Email. Try Again!', { id: loading })
            };
        } catch (error) {
            toast.error('Something Went Wrong', { id: loading })
        }
    };

    useEffect(() => {
        if (currentUser?.username === params.user) {
            setIsWonProfile(true);
        };
    }, [userLoading]);

    return (
        <>
            {allArticleLoading && userLoading && <Loading />}
            {!isLoading && !!error && (
                <div className="text-center flex justify-center items-center h-screen w-full -mt-20">
                    <p>User Not Found</p>
                </div>
            )}

            <Modal
                backdrop='blur'
                isOpen={isOpen}
                placement="auto"
                size='lg'
                onOpenChange={onOpenChange}
            >
                <form onSubmit={handleSubmit((data) => handleChangePassword(data as TFormData))}>
                    <ModalContent >
                        <>
                            <ModalHeader className="flex flex-col gap-1">Change Password</ModalHeader>
                            <ModalBody>
                                <Input
                                    label="Current Password"
                                    size='sm'
                                    type="password"
                                    variant="bordered"
                                    {...register('oldPassword')}
                                    errorMessage={currentPasswordError as string}
                                    isInvalid={!!currentPasswordError}
                                    onChange={(e) => {
                                        register('oldPassword').onChange(e);
                                        if (currentPasswordError) {
                                            setCurrentPasswordError(null);
                                        }
                                    }}
                                />
                                <Input
                                    label="New Password"
                                    size='sm'
                                    type="password"
                                    variant="bordered"
                                    {...register('newPassword')}
                                    errorMessage={errors.newPassword?.message as string}
                                    isInvalid={!!errors.newPassword}
                                />
                                <Input
                                    label="Confirm New Password"
                                    size='sm'
                                    type="password"
                                    variant="bordered"
                                    {...register('newPassword2')}
                                    errorMessage={errors.newPassword2?.message as string}
                                    isInvalid={!!errors.newPassword2}
                                />
                            </ModalBody>
                            <ModalFooter>
                                <Button color="primary" isLoading={isPassChangeLoading} type='submit' variant='flat'>
                                    Update Now
                                </Button>
                            </ModalFooter>
                        </>
                    </ModalContent>
                </form>
            </Modal>

            {!error && (
                <div className="container mx-auto max-w-7xl min-h-screen">
                    {isWonProfile && !currentUser?.isEmailVerified &&
                        <div className="h-16 hidden md:flex w-full bg-gradient-to-r mb-10 rounded-lg from-[#ff00009d] to-[#ff8c00a0] items-center justify-center text-white font-bold text-sm">
                            Action Required: Verify your email to start writing article! <span className='ml-2 underline hover:cursor-pointer' onClick={handleResendEmail}>Resent Verification Email</span>
                        </div>
                    }

                    <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                        {/* Left Column: Profile Info for mobile, Right for large screens */}
                        <div className="lg:order-2 lg:col-span-1 order-1">
                            <div className="relative group">
                                <Avatar
                                    alt={profile?.name}
                                    className="w-24 h-24 mb-3 mt-4"
                                    src={profile?.profileImg}
                                />
                                {isWonProfile && <>
                                    <label
                                        className="absolute w-24 inset-0 flex items-center justify-center bg-black bg-opacity-40 opacity-100 transition-opacity duration-300 cursor-pointer rounded-full"
                                        htmlFor="profile-picture"
                                    >
                                        {/* <span className="text-white">Change</span> */}
                                        <CiCamera className='mt-10' size={20} />
                                    </label>
                                    <input
                                        accept="image/*"
                                        className="hidden"
                                        id="profile-picture"
                                        type="file"
                                        onChange={handleChangeProfilePicture}
                                    />
                                </>}
                            </div>


                            <div className="flex gap-3 items-center">
                                {nameChangedAction ?
                                    <input className='border border-gray-400 rounded-md py-1 px-2' defaultValue={profile?.name} type="text" onChange={(e) => setUpdatedName(e.target.value)} />
                                    : <UserName isPremium={profile?.isPremiumMember} name={profile?.name} />}

                                {isWonProfile && !nameChangedAction && <FaPen className='cursor-pointer hover:transition-all hover:scale-105 hover:text-sky-600' size={13} onClick={() => setNameChangedAction(true)} />}
                                {isWonProfile && nameChangedAction && <IoMdSave className='cursor-pointer hover:transition-all hover:scale-105 hover:text-sky-600' size={20} onClick={handleNameChange} />}
                            </div>
                            <p className=" text-gray-600">@{profile?.username}</p>

                            {isWonProfile ? <Button className="mt-4" color="primary" size="sm" variant="flat" onPress={onOpen}>
                                Update Password
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

                                                <Tooltip
                                                    content={
                                                        <div className="px-3 py-1">
                                                            <div className="text-small cursor-pointer hover:scale-105 transition-all" onClick={() => handleUnfollow(following._id)}>Unfollow</div>
                                                            <div className="text-sm hover:scale-105 transition-all"><Link href={`/profile/${following.username}`}>Visit Profile</Link></div>

                                                        </div>
                                                    }
                                                >
                                                    <Button isIconOnly aria-label="More options" variant="light">
                                                        <MoreHorizontal size={16} />
                                                    </Button>
                                                </Tooltip>
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
                                                <Tooltip
                                                    content={
                                                        <div className="px-3 py-1">
                                                            <div className="text-sm hover:scale-105 transition-all"><Link href={`/profile/${follower.username}`}>Visit Profile</Link></div>
                                                        </div>
                                                    }
                                                >
                                                    <Button isIconOnly aria-label="More options" variant="light">
                                                        <MoreHorizontal size={16} />
                                                    </Button>
                                                </Tooltip>
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
                                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">{profile?.name}</h1>
                                <div className="flex mt-4 space-x-4 flex-wrap">

                                    <p className={`${render === 'home' ? 'font-medium underline' : null} cursor-pointer`} color="foreground" onClick={() => setRender('home')}>Home</p>
                                    {isWonProfile ? <>
                                        <p className='cursor-pointer' color="foreground" onClick={() => toast.info('Feature Not Ready Yet!')}>Draft</p>
                                        <p className={`${render === 'analytics' ? 'font-medium underline' : null} cursor-pointer`} color="foreground" onClick={() => setRender('analytics')}>Analytics</p>
                                        {profile?.role === 'admin' && (
                                            <>
                                                <p className={`${render === 'user' ? 'font-medium underline' : null} cursor-pointer`} color="foreground" onClick={() => setRender('user')}>Users</p>

                                                <p className={`${render === 'payout' ? 'font-medium underline' : null} cursor-pointer`} color="foreground" onClick={() => setRender('payout')}>Payout</p>

                                                {/* <p className='cursor-pointer' color="foreground" onClick={() => toast.info('Feature Not Ready Yet!')}>Payment History</p> */}
                                            </>
                                        )}
                                    </> :
                                        <>
                                            <p className='cursor-pointer' color="foreground" onClick={() => toast.info('Feature Not Ready Yet!')}>Lists</p>
                                            <p className='cursor-pointer' color="foreground" onClick={() => toast.info('Feature Not Ready Yet!')}>About</p>
                                        </>}
                                </div>
                            </div>

                            {/* conditional rendering */}

                            {
                                render === 'home' ? (

                                    Array.isArray(data) && data.length ? <>
                                        {data.map((article, indx) => <ArticlePreview key={indx} data={article} fromProfile={true} revalidate={articleRevalidate} />)}

                                        {Array.isArray(allArticle) && allArticle.length > 3 && (
                                            <Pagination totalPages={totalPages} onPageChange={setCurrentPage} />
                                        )}

                                    </> : (
                                        <div className=" h-screen flex justify-center flex-col items-center -mt-32">
                                            <h2 className='text-center'>{profile?.name} has not published any articles yet.</h2>
                                        </div>

                                    )
                                ) : render === 'analytics' ? (
                                    <div className="">
                                        <Analytics />
                                    </div>
                                ) : render === 'user' ? (
                                    <div className="">
                                        user
                                    </div>
                                ) : (
                                    <div className="">
                                        payout
                                    </div>
                                )
                            }

                        </div>
                    </main>
                </div>
            )}
        </>
    );
}
