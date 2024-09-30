'use client'

import { Card, CardBody, CardFooter, Button, Spinner } from '@nextui-org/react'
import { CheckCircle, XCircle } from 'lucide-react'
import axios from 'axios'
import useSWR from 'swr'

const fetcher = (url: string) => axios.get(url).then((res) => res.data);
export default function Verify({ params }: { params: { token: string } }) {
    const { token } = params;
    const { data, error, isLoading } = useSWR(`/api/auth/verify?token=${token}`, fetcher);

    console.log({ data, error, isLoading });

    return (
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
                        <Button color="default">Go to Dashboard</Button>
                    )}
                    {!isLoading && error && (
                        <Button color="danger" variant="flat">Resend Verification</Button>
                    )}
                </CardFooter>
            </Card>
        </div>
    )
}