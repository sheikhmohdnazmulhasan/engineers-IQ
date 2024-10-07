'use client'

import React from 'react'
import {
    Card,
    CardBody,
    Input,
    Textarea,
    Button,
} from "@nextui-org/react"
import { PhoneIcon, EnvelopeIcon, MapPinIcon } from '@heroicons/react/24/outline'
import { motion, Variants } from 'framer-motion'

const fadeInRight: Variants = {
    initial: { opacity: 0, x: 100 },
    animate: { opacity: 1, x: 0 },
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    transition: { duration: 0.5, ease: "easeOut" }
}

export default function ContactPage() {
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        // Handle form submission logic here
        console.log('Form submitted')
    }

    return (
        <motion.div
            animate="animate"
            className="container mx-auto py-8"
            initial="initial"
            variants={{
                animate: { transition: { staggerChildren: 0.1 } }
            }}
        >
            <motion.h1 className="text-3xl font-bold mb-6" variants={fadeInRight}>Get in Touch</motion.h1>
            <motion.p className="mb-8 text-gray-600" variants={fadeInRight}>
                We&apos;d love to hear from you! Whether you have a question about your booking, need assistance, or just want to give us feedback, feel free to reach out to us through any of the methods below.
            </motion.p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                <motion.div className="space-y-4" variants={fadeInRight}>
                    <Card className='py-3'>
                        <CardBody className="flex flex-row items-center space-x-4">
                            <PhoneIcon className="h-6 w-6 text-primary" />
                            <div>
                                <h2 className="text-lg font-semibold">Phone</h2>
                                <p className="text-primary">Call us at: +1 (555) 123-4567</p>
                                <p className="text-sm text-gray-500">We&apos;re available 24/7 to assist you.</p>
                            </div>
                        </CardBody>
                    </Card>

                    <Card className='py-3'>
                        <CardBody className="flex flex-row items-center space-x-4">
                            <EnvelopeIcon className="h-6 w-6 text-primary" />
                            <div>
                                <h2 className="text-lg font-semibold">Email</h2>
                                <p className="text-primary">Send us an email at: support@engineersiq.com</p>
                                <p className="text-sm text-gray-500">We&apos;ll get back to you as soon as possible.</p>
                            </div>
                        </CardBody>
                    </Card>

                    <Card className='py-3'>
                        <CardBody className="flex flex-row items-center space-x-4">
                            <MapPinIcon className="h-6 w-6 text-primary" />
                            <div>
                                <h2 className="text-lg font-semibold">Visit Us</h2>
                                <p>123 EngineersIQ HQ, San Francisco, CA 94105</p>
                                <p className="text-sm text-gray-500">Office hours: Mon-Fri, 9 AM - 6 PM</p>
                            </div>
                        </CardBody>
                    </Card>
                </motion.div>

                <motion.div variants={fadeInRight}>
                    <Card>
                        <CardBody>
                            <h2 className="text-xl font-semibold mb-4">Contact Form</h2>
                            <form className="space-y-4" onSubmit={handleSubmit}>
                                <Input
                                    label="Your Name"
                                    placeholder="Enter your name"
                                    variant="bordered"
                                />
                                <Input
                                    label="Your Email"
                                    placeholder="Enter your email"
                                    type="email"
                                    variant="bordered"
                                />
                                <Textarea
                                    label="Your Message"
                                    minRows={4}
                                    placeholder="Enter your message"
                                    variant="bordered"
                                />
                                <Button className="w-full" color="primary" type="submit">
                                    Send Message
                                </Button>
                            </form>
                        </CardBody>
                    </Card>
                </motion.div>
            </div>

            <motion.div variants={fadeInRight}>
                <h2 className="text-2xl font-bold mb-4">Our Location</h2>
                <Card>
                    <CardBody className="p-0 h-[400px]">
                        <iframe
                            allowFullScreen={false}
                            height="100%"
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.0977600296347!2d-122.41941708468212!3d37.77492997975892!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8085809c6c8f4459%3A0xb10ed6d9b5050fa5!2sTwitter%20HQ!5e0!3m2!1sen!2sus!4v1652384760244!5m2!1sen!2sus"
                            style={{ border: 0 }}
                            title="EngineersIQ Location"
                            width="100%"
                        />
                    </CardBody>
                </Card>
            </motion.div>
        </motion.div>
    )
}