'use client'

import { Button, Card } from "@nextui-org/react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useState } from "react";

import sendAccountVerificationEmail from "@/utils/send_account_verification_email";
import Loading from "@/components/loading";
const NextStep = () => {
    const searchParams = useSearchParams();
    const email = searchParams.get('email');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isSucceed, setIsSucceed] = useState<boolean>(false);
    const router = useRouter();


    const handleResendEmail = async () => {
        setIsLoading(true);
        setIsSucceed(false)

        if (email) {
            const emailRes = await sendAccountVerificationEmail({ email });
            if (emailRes?.status === 200) {
                toast.success('Email Send. Plz Check Your Inbox and Spam Folder');
                setIsLoading(false);
                setIsSucceed(true);
            } else {
                toast.error('Failed To Resend Email. Try Again!')
                setIsLoading(false);
            };

        } else {
            toast.error('Something Went Wrong!')
            setIsLoading(false);
        }
    };

    return (
        <>
            {isLoading && <Loading />}
            <div className="h-screen flex justify-center items-center fixed inset-0 px-5">
                <Card className="max-w-lg mx-auto p-5">
                    <h1 className="text-2xl mb-">Verify Your Email</h1>
                    <p className="mb-4">Please check your email for a verification link. You must verify your email to activate your account.</p>
                    <p className="">We have sent a verification link to: <b>{email}</b></p>

                    <div className="space-y-4 mt-5">
                        <Button className="w-full" onClick={handleResendEmail}>Resend Email</Button>
                        <Button className="w-full" color="secondary" variant="flat" onClick={() => router.push('/auth/login')} >{isSucceed ? 'Go Profile' : 'Skip for Now'}</Button>
                    </div>
                </Card>
            </div>
        </>
    );
};

export default NextStep;