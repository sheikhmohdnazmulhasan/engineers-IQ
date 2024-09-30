'use client'

import { Button, Card } from "@nextui-org/react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";

import sendAccountVerificationEmail from "@/utils/send_account_verification_email";
const NextStep = () => {
    const searchParams = useSearchParams();
    const email = searchParams.get('email');

    const handleResendEmail = async () => {
        if (email) {
            const emailRes = await sendAccountVerificationEmail({ email });

            console.log(emailRes);

        } else {
            toast.error('Something Went Wrong!')
        }
    };

    const handleSkip = () => {
        console.log(process.env.NEXT_PUBLIC_MONGODB_CONNECTION_STRING);
    };

    return (
        <div className="h-screen flex justify-center items-center fixed inset-0 px-5">
            <Card className="max-w-lg mx-auto p-5">
                <h1 className="text-2xl mb-">Verify Your Email</h1>
                <p className="mb-4">Please check your email for a verification link. You must verify your email to activate your account.</p>
                <p className="">We have sent a verification link to: <b>{email}</b></p>

                <div className="space-y-4 mt-5">
                    <Button className="w-full" onClick={handleResendEmail}>Resend Email</Button>
                    <Button className="w-full" color="secondary" variant="flat" onClick={handleSkip}>Skip for Now</Button>
                </div>
            </Card>
        </div>
    );
};

export default NextStep;