'use client'

import React, { useEffect, useState } from 'react'
import { Button, Card, CardBody, Avatar, Chip, Input } from "@nextui-org/react"
import { toast } from 'sonner'
import Link from 'next/link'
import { SearchIcon } from 'lucide-react'

import { ArticlePreview } from '@/components/article_preview'
import { SidebarSection } from '@/components/home/sidebar_section'
import useUser from '@/hooks/useUser'
import useWhoToFollow from '@/hooks/use_who_to_follow'
import { IWhoToFollowResponse } from '@/interface/who_to_follow.response.interface'
import UserName from '@/components/premium_acc_badge'
import axiosInstance from '@/libs/axiosInstance'
import { INotificationEmail } from '@/interface/email.notification.interface'
import sendNotificationEmail from '@/utils/send_notification_email'
import { topicsData } from '@/const/article/topics'
import useArticle from '@/hooks/use_articles'
import Loading from '@/components/loading'
import { categoriesData } from '@/const/article/categories'
import { IArticleResponse } from '@/interface/articles.response.interface'
import Pagination from '@/components/pagination'
import useDebounce from '@/hooks/debounce'

export default function Home() {
  const { currentUser } = useUser();
  const { whoToFollow, revalidate } = useWhoToFollow(currentUser?._id as string);
  const [loading, setLoading] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setCategory] = useState<string>('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const limit = 3
  const { data: allArticles } = useArticle({});
  const totalPages = Math.ceil(Array.isArray(allArticles) ? allArticles.length / limit : 0);

  const query = {
    page: currentPage,
    limit,
    searchTerm: debouncedSearchTerm,
    category: selectedCategory
  }

  // data for mapping
  const { data, isLoading } = useArticle(query);

  // function handleCategorySearch(e: HTMLFormElement) {
  //   console.log();
  // }

  async function handleFollowNewPerson(target: IWhoToFollowResponse, indx: number) {
    setLoading(indx)
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
        setLoading(null);
      }
    } catch (error) {
      toast.error('Something Went Wrong!');
      revalidate();
      setLoading(null)
    }
  }

  useEffect(() => {
    setCurrentPage(1);
    setSearchTerm(debouncedSearchTerm);

  }, [debouncedSearchTerm]);

  return (
    <div className='-mt-14'>
      {isLoading && <Loading />}
      <Input
        aria-label="Search"
        classNames={{
          inputWrapper: "bg-default-100",
          input: "text-sm",
        }}
        labelPlacement="outside"
        placeholder="Search..."
        startContent={
          <SearchIcon className="text-base text-default-400 pointer-events-none flex-shrink-0" />
        }
        type="search"
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div className="min-h-screen bg-background mt-10">
        <div className="container mx-auto">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="w-full lg:w-2/3">
              <div className="mb-6 flex space-x-2 overflow-x-auto">
                <Chip className='hover:cursor-pointer ' color={!selectedCategory ? 'primary' : 'default'} variant="flat" onClick={() => setCategory('')}>Latest</Chip>

                {categoriesData.slice(0, 5).map((category, indx) => (
                  <Chip key={indx} className='hover:cursor-pointer' color={selectedCategory === category.key ? 'primary' : 'default'} variant="flat" onClick={() => setCategory(category.key)}>{category.label}</Chip>
                ))}
              </div>

              {/* data card mapping */}
              {Array.isArray(data) && data?.map((article: IArticleResponse, indx: number) => <ArticlePreview key={indx} data={article} />)}

              {Array.isArray(allArticles) && allArticles.length > 3 && < Pagination
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />}

            </div>
            <div className="w-full lg:w-1/3">
              <div className="sticky top-20">

                {/* system pics */}
                {/* data.sort(() => 0.5 - Math.random()).slice(0, 3)? */}

                <SidebarSection title="System Picks">
                  {Array.isArray(data) && data.slice(0, 3).reverse().map((article, indx) => (
                    <Link key={indx} href={`/articles/${article.author.username}/${article._id}`}>
                      <Card className="mb-2">
                        <CardBody>
                          <h4 className="font-semibold">{article.title}</h4>
                          <p className="text-small text-default-500">{article.textArea.slice(0, 40)}</p>
                        </CardBody>
                      </Card>
                    </Link>
                  ))}
                </SidebarSection>
                <SidebarSection title="Recommended topics">
                  <div className="flex flex-wrap gap-2">
                    {topicsData.slice(0, topicsData.length / 2).reverse().map((topic, index) => (
                      <Link key={index} href={`/articles/tag/${topic.key}`}> <Chip variant="flat">{topic.label}</Chip></Link>
                    ))}
                  </div>
                </SidebarSection>
                {currentUser && (
                  <SidebarSection title="Who to follow">
                    <div className="space-y-4">
                      {whoToFollow?.map((user: IWhoToFollowResponse, indx) => (
                        <div key={indx} className="flex items-center justify-between">
                          <Link className="flex items-center" href={`/profile/${user.username}`}>
                            <Avatar className="mr-2" size="sm" src={user?.profileImg} />
                            <div>
                              <UserName isPremium={user.isPremiumMember} name={user.name} />
                              <p className="text-small text-default-500">@{user.username}</p>
                            </div>
                          </Link>

                          <Button isLoading={loading === indx} size="sm" variant="flat" onClick={() => handleFollowNewPerson(user, indx)}>Follow</Button>
                        </div>
                      ))}
                    </div>
                  </SidebarSection>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}