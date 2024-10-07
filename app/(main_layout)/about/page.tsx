/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck

"use client"

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Card, CardBody, Button } from "@nextui-org/react"
import { LightBulbIcon, UsersIcon, BoltIcon, StarIcon } from '@heroicons/react/24/outline'

const fadeInRight = {
    initial: { opacity: 0, x: 100 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.5, ease: "easeOut" }
}

const FeatureCard = ({ title, icon: Icon, description }: { title: string; icon: React.ElementType; description: string }) => (
    <Card>
        <CardBody className="p-6 flex flex-col items-center text-center">
            <Icon className="w-8 h-8 text-blue-600 mb-2" />
            <h3 className="text-lg font-semibold mb-2">{title}</h3>
            <p>{description}</p>
        </CardBody>
    </Card>
)

const features = [
    { title: "Expert Advice", icon: LightBulbIcon, description: "Insights from industry professionals." },
    { title: "Community-Driven", icon: UsersIcon, description: "Learn and collaborate with fellow engineers." },
    { title: "Latest Tech News", icon: BoltIcon, description: "Stay updated with cutting-edge technology." },
    { title: "Product Reviews", icon: StarIcon, description: "Make informed decisions on engineering tools." },
]

export default function AboutUs() {
    return (
        <motion.div
            animate="animate"
            className="container mx-auto py-8"
            initial="initial"
            variants={{
                animate: { transition: { staggerChildren: 0.1 } }
            }}
        >
            <motion.div className="text-center mb-12" variants={fadeInRight}>
                <h1 className="text-5xl font-bold mb-4">EngineersIQ</h1>
                <h2 className="text-2xl">Transforming Ideas into Code, Together.</h2>
            </motion.div>

            <motion.div className="mb-12" variants={fadeInRight}>
                <h2 className="text-3xl font-semibold mb-4">Our Mission</h2>
                <div className="space-y-4">
                    <p>
                        At EngineersIQ, we believe in the transformative power of software engineering to shape the future. Our mission is to create an inclusive, knowledge-rich platform that empowers software engineers of all experience levels to thrive in an ever-evolving digital landscape. We are committed to bridging the gap between emerging technologies and real-world application, offering our community the tools, resources, and collaborative spaces they need to excel.
                    </p>
                    <p>
                        Through expert-led content, up-to-date industry insights, and peer-to-peer learning, we aim to foster a culture of continuous growth, innovation, and collaboration. Whether you're just starting your coding journey or are a seasoned professional looking to stay on top of the latest trends, EngineersIQ is here to provide the guidance, support, and connections you need to succeed.
                    </p>
                    <p>
                        We envision a future where every software engineer has the knowledge, confidence, and resources to solve complex problems, build groundbreaking software, and contribute meaningfully to the tech industry. By focusing on practical, hands-on learning and community-driven growth, we seek to cultivate the next generation of software leaders and innovators.
                    </p>
                </div>
            </motion.div>

            <motion.div className="mb-12" variants={fadeInRight}>
                <h2 className="text-3xl font-semibold mb-4">Our Community</h2>
                <p className="mb-4">
                    EngineersIQ is more than just a platform; it's a thriving community of engineers, professionals, and curious learners.
                    Our diverse user base contributes to a rich ecosystem of knowledge, where everyone has something to learn and something to teach.
                </p>
                <p>
                    Whether you're troubleshooting a complex engineering problem, exploring new tools, or diving into
                    the world of coding, you'll find a supportive community ready to help and collaborate.
                </p>
            </motion.div>

            <motion.div className="mb-12" variants={fadeInRight}>
                <h2 className="text-3xl font-semibold text-center mb-6">What We Offer</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature, index) => (
                        <motion.div key={index} variants={fadeInRight}>
                            <FeatureCard {...feature} />
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            <motion.div className="text-center" variants={fadeInRight}>
                <h2 className="text-3xl font-semibold mb-4">Join Our Engineering Community</h2>
                <p className="mb-8">
                    Ready to enhance your engineering knowledge and connect with like-minded enthusiasts?
                </p>
                <Link passHref href="/auth/register">
                    <Button className="font-semibold" color="primary" size="lg">
                        Sign Up Now
                    </Button>
                </Link>
            </motion.div>
        </motion.div>
    )
}