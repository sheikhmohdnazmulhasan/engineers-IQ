'use client'

import { Card, CardBody, CardFooter, Button, Spinner } from '@nextui-org/react'
import { CheckCircle, XCircle } from 'lucide-react'
import axios from 'axios'
import useSWR from 'swr'
import Link from 'next/link'
import { toast } from 'sonner'
import { useState } from 'react'

import { decrypt } from '@/utils/text_encryptor'
import sendAccountVerificationEmail from '@/utils/send_account_verification_email'
import Loading from '@/components/loading'

const fetcher = (url: string) => axios.get(url).then((res) => res.data);
export default function Verify({ params }: { params: { token: string } }) {
    const { token } = params;
    const { data, error, isLoading } = useSWR(`/api/auth/verify?token=${token}`, fetcher);
    const [sendEmailLoading, setSendEmailLoading] = useState<boolean>(false)

    async function handleResentEmail() {
        setSendEmailLoading(true);

        try {
            const decryptData = decrypt(token);
            if (decryptData) {
                const spied = decryptData.split('+++');
                const emailRes = await sendAccountVerificationEmail({ email: spied[0] });

                if (emailRes?.status === 200) {
                    setSendEmailLoading(false);
                    toast.success('Email Send. Plz Check Your Inbox and Spam Folder');
                } else {
                    setSendEmailLoading(false);
                    toast.error('Something Went Wrong!');
                }

            } else {
                setSendEmailLoading(false)
                toast.error('Something Went Wrong!');
            }

        } catch (error) {
            setSendEmailLoading(false);
            toast.error('Something Went Wrong!');
        }
    }

    return (
        <>
            {sendEmailLoading && <Loading />}
            <div className="min-h-screen flex items-center justify-center">
                <Card className="w-full max-w-2xl py-10">

                    <CardBody className="flex flex-col items-center">
                        {isLoading && (
                            <Spinner size="lg" />
                        )}
                        {data && (
                            <CheckCircle className="h-16 w-16 text-success" />
                        )}
                        {!isLoading && error && (
                            <XCircle className="h-16 w-16 text-danger" />
                        )}
                        <p className="mt-4 text-center">
                            {isLoading && 'Please wait while we verify your account...'}
                            {!error && !isLoading && data && 'Your account has been successfully verified!'}
                            {!isLoading && error && 'There was an error verifying your account. Please try again.'}
                        </p>
                    </CardBody>
                    <CardFooter className="flex justify-center">
                        {data && (
                            <Link href={'/profile'}><Button color="default">Go to Profile</Button></Link>
                        )}
                        {!isLoading && error && (
                            <Button color="danger" variant="flat" onClick={handleResentEmail}>Resend Verification</Button>
                        )}
                    </CardFooter>
                </Card>
            </div>
        </>
    )
}