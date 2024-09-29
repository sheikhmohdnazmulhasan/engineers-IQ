'use client'

import { useState, useEffect } from 'react'
import { Card, CardBody, CardFooter, Button, Spinner } from '@nextui-org/react'
import { CheckCircle, XCircle } from 'lucide-react'

export default function Verify({ params }: { params: { token: string } }) {



    const [verificationStatus, setVerificationStatus] = useState<'loading' | 'success' | 'error'>('loading');

    useEffect(() => {
        // Simulate verification process
        const timer = setTimeout(() => {
            // Randomly set success or error for demonstration
            setVerificationStatus(Math.random() > 0.5 ? 'success' : 'error')
        }, 2000)

        return () => clearTimeout(timer)
    }, [])

    return (
        <div className="min-h-screen flex items-center justify-center">
            <Card className="w-full max-w-2xl py-10">

                <CardBody className="flex flex-col items-center">
                    {verificationStatus === 'loading' && (
                        <Spinner size="lg" />
                    )}
                    {verificationStatus === 'success' && (
                        <CheckCircle className="h-16 w-16 text-success" />
                    )}
                    {verificationStatus === 'error' && (
                        <XCircle className="h-16 w-16 text-danger" />
                    )}
                    <p className="mt-4 text-center">
                        {verificationStatus === 'loading' && 'Please wait while we verify your account...'}
                        {verificationStatus === 'success' && 'Your account has been successfully verified!'}
                        {verificationStatus === 'error' && 'There was an error verifying your account. Please try again.'}
                    </p>
                </CardBody>
                <CardFooter className="flex justify-center">
                    {verificationStatus === 'success' && (
                        <Button color="default">Go to Dashboard</Button>
                    )}
                    {verificationStatus === 'error' && (
                        <Button color="danger" variant="flat">Resend Verification</Button>
                    )}
                </CardFooter>
            </Card>
        </div>
    )
}