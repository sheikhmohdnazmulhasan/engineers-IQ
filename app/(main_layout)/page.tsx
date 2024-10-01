'use client'

import React from 'react'
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Input, Button, Card, CardBody, CardHeader, Avatar, Chip } from "@nextui-org/react"
import { SearchIcon, BookmarkIcon, MoreHorizontalIcon } from 'lucide-react'

const ArticlePreview = ({ title, author, snippet, date, readTime, image, tags }) => (
  <Card className="mb-6 border-b border-gray-200 pb-6">
    <CardBody>
      <div className="flex items-center mb-2">
        <Avatar src={author.avatar} size="sm" className="mr-2" />
        <span className="text-small font-medium">{author.name}</span>
      </div>
      <h2 className="text-xl font-bold mb-2">{title}</h2>
      <p className="text-default-500 mb-4">{snippet}</p>
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <span className="text-small text-default-400">{date}</span>
          <span className="text-small text-default-400">{readTime} min read</span>
          <div className="flex space-x-1">
            {tags.map((tag, index) => (
              <Chip key={index} size="sm" variant="flat">{tag}</Chip>
            ))}
          </div>
        </div>
        {image && <img src={image} alt={title} className="w-24 h-24 object-cover rounded" />}
      </div>
      <div className="flex justify-between items-center mt-4">
        <Button size="sm" variant="light">
          <BookmarkIcon size={16} />
        </Button>
        <Button size="sm" variant="light" isIconOnly>
          <MoreHorizontalIcon size={16} />
        </Button>
      </div>
    </CardBody>
  </Card>
)

const SidebarSection = ({ title, children }) => (
  <div className="mb-6">
    <h3 className="text-lg font-bold mb-2">{title}</h3>
    {children}
  </div>
)

export default function Component() {
  const topics = ['Economics', 'DevOps', 'World', 'Product Management', 'Ethereum', 'Feminism', 'Data Visualization']

  return (
    <div className="min-h-screen bg-background">

      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-2/3">
            <div className="mb-6 flex space-x-2 overflow-x-auto">
              <Chip color="primary" variant="flat">For you</Chip>
              <Chip variant="flat">Following</Chip>
              <Chip variant="flat">Technology</Chip>
              <Chip variant="flat">Programming</Chip>
              <Chip variant="flat">Data Science</Chip>
              <Chip variant="flat">Productivity</Chip>
            </div>
            <ArticlePreview
              title="Nine things you gotta stop doing if you want more focus"
              author={{ name: "Alex Mathers", avatar: "/placeholder.svg?height=40&width=40" }}
              snippet="What even is 'focus'? It's a term we throw around a lot, but do we really understand what it means to be focused? In this article, we'll explore the concept of focus and how to achieve it in your daily life."
              date="2d ago"
              readTime={5}
              image="/placeholder.svg?height=96&width=96"
              tags={['Productivity', 'Self Improvement']}
            />

          </div>
          <div className="w-full md:w-1/3">
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
              <SidebarSection title="Who to follow">
                <div className="space-y-4">
                  {['Jane Doe', 'John Smith', 'Alice Johnson'].map((name, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Avatar src={`/placeholder.svg?height=40&width=40`} size="sm" className="mr-2" />
                        <div>
                          <p className="font-medium">{name}</p>
                          <p className="text-small text-default-500">Short bio here</p>
                        </div>
                      </div>
                      <Button size="sm" variant="flat">Follow</Button>
                    </div>
                  ))}
                </div>
              </SidebarSection>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}