/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/alt-text */
'use client'

import React, { useEffect, useState } from 'react'
import { Input, Textarea } from '@nextui-org/input';
import { Button, Checkbox, Select, SelectItem, } from '@nextui-org/react';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { LockIcon, X } from 'lucide-react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import dynamic from 'next/dynamic';

import { categoriesData } from '@/const/article/categories';
import { topicsData } from '@/const/article/topics';
import uploadImageToImgBb from '@/utils/upload_image_to_imgbb';
import useUser from '@/hooks/useUser';
import Loading from '@/components/loading';
import useArticle from '@/hooks/use_articles';
import { IArticleResponse } from '@/interface/articles.response.interface';
import { useUpdateArticle } from '@/hooks/operations/hook_oparetion_update_article';
import { formats, modules } from '@/config/editor.config';
import { encrypt } from '@/utils/text_encryptor';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

export default function EditArticle({ params }: { params: { postId: string } }) {
    const { isLoading, currentUser } = useUser();
    const { data, isLoading: prevLoading, error } = useArticle({ _id: params.postId });
    const [files, setFiles] = useState<File[]>([])
    const [showImagePreview, setShowImagePreview] = useState<string[]>([]);
    const [imagesLoaded, setImageLoaded] = useState(true);
    const { register, handleSubmit, watch } = useForm();
    const [loading, setLoading] = useState(false);
    const shortDes = watch('textArea');
    const [prevData, setPrevData] = useState<IArticleResponse | null>(data ? data as IArticleResponse : null);
    const encryptedToken = encrypt(currentUser?._id as unknown as string);
    const { mutate, isSuccess, isError } = useUpdateArticle(currentUser?.username as string, params.postId, encryptedToken);
    const [content, setContent] = useState('');
    const { theme } = useTheme()

    const handleChange = (value: string) => {
        setContent(value);
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleFileChange = (event: { target: { files: any; }; }) => {
        const selectedFiles = event.target.files;

        if (selectedFiles && selectedFiles.length > 0) {
            setFiles(Array.from(selectedFiles));
            setImageLoaded(true)
        }
    }

    const handleClearFile = () => {
        setImageLoaded(false)
        setShowImagePreview([]);
    };

    const handleSave: SubmitHandler<FieldValues> = async (data) => {

        const topics = String(data.topics).split(',');
        const payload = {
            ...data,
            author: currentUser?._id,
            description: content,
            topics,
        }

        setLoading(true);

        if (shortDes?.length < 200 || shortDes?.length > 300) {
            toast.error('Short description should be between 200 and 300 characters.');
            setLoading(false);
            return;
        }

        if (files.length) {
            try {
                const imgRes = await uploadImageToImgBb(files);

                if (imgRes.success) {
                    // @ts-expect-error: I have no time to resolved
                    payload.images = imgRes.urls
                }

            } catch (error) {
                toast.error('Failed to update images!');
                setLoading(false);
                return
            };
        };

        try {
            mutate(payload);

            if (isSuccess) {
                setLoading(false);
            }
            if (isError) {
                toast.error('Something went wrong!');
                setLoading(false);
            }
        } catch (error) {
            setLoading(false);
            toast.error('Something Bad Happened!');
        }
    };

    // preview files
    useEffect(() => {
        if (files.length) {
            const previewUrl = files.map((file) => URL.createObjectURL(file));
            setShowImagePreview(previewUrl);
        }

    }, [files]);

    useEffect(() => {
        setPrevData(data as IArticleResponse);
    }, [prevLoading]);

    return (
        <>
            {isLoading && <Loading />}

            {!isLoading && !currentUser && (
                <div className="inset-0 flex items-center h-screen -mt-28 justify-center">
                    <div className="text-center">
                        <LockIcon className="w-12 h-12 text-[#1877F2] mb-4 mx-auto" />
                        <Link href='/auth/login?redirect=/new'>
                            <Button color="primary" variant="bordered">
                                Login to Edit Contents
                            </Button>
                        </Link>
                    </div>
                </div>
            )}

            {
                error && (
                    <div className="inset-0 flex items-center h-screen -mt-28 justify-center">
                        <div className="text-center">
                            {/* <LockIcon className="w-12 h-12 text-[#1877F2] mb-4 mx-auto" /> */}
                            <X color='error' size={60} />
                            <h1 className='mb-2'>Something Bad Happened!</h1>
                            <Button color="primary" variant="bordered" onClick={() => window.location.reload()}>
                                Try again
                            </Button>
                        </div>
                    </div>
                )
            }

            {
                prevData?.author._id !== currentUser?._id && (
                    <div className="inset-0 flex items-center h-screen -mt-28 justify-center">
                        <div className="text-center">
                            <LockIcon className="w-12 h-12 text-[#1877F2] mb-4 mx-auto" />
                            <h1 className='mb-2'>Access Denied</h1>
                            <Button color="primary" variant="bordered" onClick={() => window.location.reload()}>
                                Try again
                            </Button>
                        </div>
                    </div>
                )
            }

            {
                currentUser && !error && prevData?.author._id === currentUser?._id && (
                    <form className="space-y-4" onSubmit={handleSubmit(handleSave)}>
                        <h3 className='text-primary-600'>Note: If all previous data is not loaded then please go back one step and come again</h3>
                        <h1 className='text-3xl'>Edit {prevData?.title}</h1>
                        <p>EngineersIQ is more than just a platform; it&apos;s a thriving community of engineers, professionals, and curious learners. Our diverse user base contributes to a rich ecosystem of knowledge, where everyone has something to learn and something to teach.</p>
                        <div className='pt-5 space-y-4'>
                            <Input
                                isRequired
                                defaultValue={prevData?.title}
                                label='Title'
                                size='sm'
                                type='text'
                                {...register('title')} />
                            <Textarea
                                isRequired
                                label=" Short Description (>200 <300)"
                                {...register('textArea')}
                                defaultValue={prevData?.textArea}
                                isInvalid={shortDes && shortDes?.length < 200 || shortDes?.length > 300}
                            />
                            <div className=" md:flex gap-4 space-y-4 md:space-y-0">
                                <Select
                                    isRequired
                                    items={categoriesData}
                                    label="Category"
                                    size='sm'
                                    {...register('category')}
                                    defaultSelectedKeys={[prevData?.category as string]}
                                >
                                    {(category) => <SelectItem key={category.key}>{category.label}</SelectItem>}
                                </Select>
                                <Select
                                    isRequired
                                    defaultSelectedKeys={prevData?.topics}
                                    items={topicsData}
                                    label="Select Topics"
                                    selectionMode='multiple'
                                    size='sm'
                                    {...register('topics')}
                                >
                                    {(topic) => <SelectItem key={topic.key}>{topic.label}</SelectItem>}
                                </Select>
                            </div>
                        </div>

                        <div className="h-[430px]">
                            <ReactQuill className='h-96' defaultValue={prevData?.description} formats={formats} modules={modules} theme="snow" onChange={handleChange} />
                        </div>

                        <div className="  my-10 ">
                            {imagesLoaded ? (
                                <div className=" mx-auto flex flex-wrap items-center gap-x-6 border p-5 space-y-4">

                                    {showImagePreview.length ?
                                        showImagePreview?.map((img, indx) => <img key={indx} className="w-full max-w-[150px] rounded-lg object-cover" src={img} />) :

                                        prevData?.images.map((img: string, indx: number) => <img key={indx} className="w-full max-w-[150px] rounded-lg object-cover" src={img} />)}

                                    <div className="flex-1 space-y-1.5 overflow-hidden">
                                        {/* <h5 className="text-xl font-medium tracking-tight truncate">{showName?.name}</h5> */}
                                        {/* <p className="text-gray-500">{(showName.size / 1024).toFixed(1)} KB</p> */}
                                    </div>
                                    <div onClick={handleClearFile}>
                                        <svg fill="none" viewBox="0 -0.5 25 25" width={30} xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0" /><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" /><g id="SVGRepo_iconCarrier"><path d="M6.96967 16.4697C6.67678 16.7626 6.67678 17.2374 6.96967 17.5303C7.26256 17.8232 7.73744 17.8232 8.03033 17.5303L6.96967 16.4697ZM13.0303 12.5303C13.3232 12.2374 13.3232 11.7626 13.0303 11.4697C12.7374 11.1768 12.2626 11.1768 11.9697 11.4697L13.0303 12.5303ZM11.9697 11.4697C11.6768 11.7626 11.6768 12.2374 11.9697 12.5303C12.2626 12.8232 12.7374 12.8232 13.0303 12.5303L11.9697 11.4697ZM18.0303 7.53033C18.3232 7.23744 18.3232 6.76256 18.0303 6.46967C17.7374 6.17678 17.2626 6.17678 16.9697 6.46967L18.0303 7.53033ZM13.0303 11.4697C12.7374 11.1768 12.2626 11.1768 11.9697 11.4697C11.6768 11.7626 11.6768 12.2374 11.9697 12.5303L13.0303 11.4697ZM16.9697 17.5303C17.2626 17.8232 17.7374 17.8232 18.0303 17.5303C18.3232 17.2374 18.3232 16.7626 18.0303 16.4697L16.9697 17.5303ZM11.9697 12.5303C12.2626 12.8232 12.7374 12.8232 13.0303 12.5303C13.3232 12.2374 13.3232 11.7626 13.0303 11.4697L11.9697 12.5303ZM8.03033 6.46967C7.73744 6.17678 7.26256 6.17678 6.96967 6.46967C6.67678 6.76256 6.67678 7.23744 6.96967 7.53033L8.03033 6.46967ZM8.03033 17.5303L13.0303 12.5303L11.9697 11.4697L6.96967 16.4697L8.03033 17.5303ZM13.0303 12.5303L18.0303 7.53033L16.9697 6.46967L11.9697 11.4697L13.0303 12.5303ZM11.9697 12.5303L16.9697 17.5303L18.0303 16.4697L13.0303 11.4697L11.9697 12.5303ZM13.0303 11.4697L8.03033 6.46967L6.96967 7.53033L11.9697 12.5303L13.0303 11.4697Z" fill={theme === 'dark' ? '#fff' : '#000'} /></g>
                                        </svg>
                                    </div>
                                </div>
                            ) : (
                                <label className=" mx-auto flex flex-col items-center justify-center space-y-3 border p-6" htmlFor="file5">
                                    <svg enableBackground="new 0 0 42 32" fill={theme === 'dark' ? '#fff' : '#000'} id="Layer_1" version="1.1" viewBox="0 0 42 32" width={50} xmlSpace="preserve" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"><g id="SVGRepo_bgCarrier" strokeWidth="0" /><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" /><g id="SVGRepo_iconCarrier">  <g> <path d="M33.958,12.988C33.531,6.376,28.933,0,20.5,0C12.787,0,6.839,5.733,6.524,13.384 C2.304,14.697,0,19.213,0,22.5C0,27.561,4.206,32,9,32h6.5c0.276,0,0.5-0.224,0.5-0.5S15.776,31,15.5,31H9c-4.262,0-8-3.972-8-8.5 C1,19.449,3.674,14,9,14h1.5c0.276,0,0.5-0.224,0.5-0.5S10.776,13,10.5,13H9c-0.509,0-0.99,0.057-1.459,0.139 C7.933,7.149,12.486,1,20.5,1C29.088,1,33,7.739,33,14v1.5c0,0.276,0.224,0.5,0.5,0.5s0.5-0.224,0.5-0.5V14 c0-0.003,0-0.006,0-0.009c3.019,0.331,7,3.571,7,8.509c0,3.826-3.691,8.5-8,8.5h-7.5c-3.238,0-4.5-1.262-4.5-4.5V12.783l4.078,4.07 C25.176,16.951,25.304,17,25.432,17s0.256-0.049,0.354-0.146c0.195-0.195,0.195-0.513,0-0.707l-4.461-4.452 c-0.594-0.592-1.055-0.592-1.648,0l-4.461,4.452c-0.195,0.194-0.195,0.512,0,0.707s0.512,0.195,0.707,0L20,12.783V26.5 c0,3.804,1.696,5.5,5.5,5.5H33c4.847,0,9-5.224,9-9.5C42,17.333,37.777,13.292,33.958,12.988z" />  </g></g></svg>
                                    <div className="space-y-1.5 text-center">
                                        <h5 className="whitespace-nowrap text-lg font-medium tracking-tight ">Upload Thumbnail</h5>
                                        <p className="text-sm text-gray-500">File Should be in PNG, JPEG or JPG formate</p>
                                    </div>
                                </label>
                            )}

                            <input multiple className="hidden" id="file5" type="file" onChange={handleFileChange} />
                        </div>


                        <div className="md:flex justify-between">
                            <Checkbox defaultSelected={prevData.isPremiumContent} isDisabled={!currentUser?.isPremiumMember} {...register('isPremiumContent')}>Publish as Exclusive {!currentUser?.isPremiumMember && <span>(Only For Verified Members)</span>} </Checkbox>
                            <div className=" md:flex gap-4 space-y-4 md:space-y-0 mt-4 md:mt-0">
                                <Button className='block w-full' color="primary" variant="bordered">Save Draft</Button>
                                <Button className='block w-full' color="primary" isLoading={loading} type='submit'>Update</Button>
                            </div>
                        </div>
                    </form>
                )
            }
        </>
    )
}