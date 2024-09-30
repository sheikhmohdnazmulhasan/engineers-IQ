'use client'
import { Button, Card, Text } from "@nextui-org/react";
import { useSearchParams } from "next/navigation";

const NextStep = ({ params }) => {
    const searchParams = useSearchParams();
    const email = searchParams.get('email');

    console.log(email);

    const handleResendEmail = () => {
        // Simulate email resend (Replace with your API logic)
        console.log(`Resending verification email to: sss`);
    };

    const handleSkip = () => {
        // Redirect user to the home page or dashboard after skipping
        // navigate("/dashboard");
    };

    return (
        <div className="h-screen flex justify-center items-center fixed inset-0 px-5">
            <Card className="max-w-lg mx-auto p-5">
                <h1 className="text-2xl mb-">Verify Your Email</h1>
                <p className="mb-4">Please check your email for a verification link. You must verify your email to activate your account.</p>
                <p className="">We have sent a verification link to: <b>{email}</b></p>

                <div className="space-y-4 mt-5">
                    <Button className="w-full" onClick={handleResendEmail}>Resend Email</Button>
                    <Button className="w-full" variant="flat" color="secondary" onClick={handleSkip}>Skip for Now</Button>
                </div>
            </Card>
        </div>
    );
};

export default NextStep;