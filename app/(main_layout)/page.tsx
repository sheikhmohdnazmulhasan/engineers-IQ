'use client'

import React from 'react'
import { Button, Card, CardBody, Avatar, Chip } from "@nextui-org/react"
import { toast } from 'sonner'

import { ArticlePreview } from '@/components/article_preview'
import { SidebarSection } from '@/components/home/sidebar_section'
import useUser from '@/hooks/useUser'
import useWhoToFollow from '@/hooks/use_who_to_follow'
import { IWhoToFollowResponse } from '@/interface/who_to_follow.response.interface'
import UserName from '@/components/premium_acc_badge'
import axiosInstance from '@/libs/axiosInstance'

export default function Home() {
  const { currentUser } = useUser();
  const { whoToFollow, revalidate } = useWhoToFollow(currentUser?._id as string);
  const topics = ['Economics', 'DevOps', 'World', 'Product Management', 'Ethereum', 'Feminism', 'Data Visualization']

  async function handleFollowNewPerson(id: string) {
    const payload = {
      follower: currentUser?._id,
      following: id
    }

    const serverRes = await axiosInstance.patch('/follow', payload);

    if (serverRes.status === 200) {
      revalidate()
      toast.success('Following');
    }
  }

  return (
    <div className="min-h-screen bg-background">

      <div className="container mx-auto">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-2/3">
            <div className="mb-6 flex space-x-2 overflow-x-auto">
              <Chip color="primary" variant="flat">For you</Chip>
              <Chip variant="flat">Following</Chip>
              <Chip variant="flat">Technology</Chip>
              <Chip variant="flat">Programming</Chip>
              <Chip variant="flat">Data Science</Chip>
              <Chip variant="flat">Productivity</Chip>
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
          <div className="w-full lg:w-1/3">
            <div className="sticky top-20">
              <SidebarSection title="Staff Picks">
                <Card className="mb-2">
                  <CardBody>
                    <h4 className="font-semibold">How I Burned My Resume and Built a New Career</h4>
                    <p className="text-small text-default-500">Neela in Psychology of Workplaces</p>
                  </CardBody>
                </Card>
                <Card className="mb-2">
                  <CardBody>
                    <h4 className="font-semibold">Why I Stopped Boycotting Businesses and Cutting People Off Because of Their Political Views</h4>
                    <p className="text-small text-default-500">Alisa Wolf in Human Parts</p>
                  </CardBody>
                </Card>
                <Card className="mb-2">
                  <CardBody>
                    <h4 className="font-semibold">The Art of Productive Procrastination</h4>
                    <p className="text-small text-default-500">Mark Johnson in Better Humans</p>
                  </CardBody>
                </Card>
              </SidebarSection>
              <SidebarSection title="Recommended topics">
                <div className="flex flex-wrap gap-2">
                  {topics.map((topic, index) => (
                    <Chip key={index} variant="flat">{topic}</Chip>
                  ))}
                </div>
              </SidebarSection>
              {currentUser && (
                <SidebarSection title="New to the world">
                  <div className="space-y-4">
                    {whoToFollow?.map((user: IWhoToFollowResponse, indx) => (
                      <div key={indx} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Avatar className="mr-2" size="sm" src={user?.profileImg} />
                          <div>
                            <UserName isPremium={user.isPremiumMember} name={user.name} />
                            <p className="text-small text-default-500">@{user.username}</p>
                          </div>
                        </div>

                        <Button size="sm" variant="flat" onClick={() => handleFollowNewPerson(user?._id)}>Follow</Button>
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
  )
}