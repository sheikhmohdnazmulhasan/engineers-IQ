'use client'

import { Button, Card, CardBody, CardHeader, Input, Link } from "@nextui-org/react"
import { zodResolver } from "@hookform/resolvers/zod";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { signIn } from 'next-auth/react';
import { useState } from "react";
import { useRouter } from "next/navigation";

import { loginValidationSchema } from "@/validations/login.validation";
import Loading from "@/components/loading";

export default function Login() {
    const [customError, setCustomError] = useState<null | string>(null)
    const [loading, setLoading] = useState<boolean>(false);
    const router = useRouter()

    const { handleSubmit, register, formState: { errors } } = useForm({
        resolver: zodResolver(loginValidationSchema) // Using Zod for form validation
    });

    const handleLogin: SubmitHandler<FieldValues> = async (data) => {
        localStorage.removeItem('signed_email');
        setCustomError(null);
        setLoading(true);

        const result = await signIn('credentials', {
            redirect: false,
            email: data.email,
            password: data.password,
        });

        if (result?.error) {
            setCustomError('Invalid Email or Password!')
            setLoading(false);
        } else if (result?.ok) {
            localStorage.setItem('signed_email', data.email)
            setCustomError(null);
            setLoading(false);

            // Redirect to a protected page (or home)
            router.push('/'); // Change this to your protected page
        }
    };

    return (
        <>
            {loading && <Loading />}
            <div className="min-h-screen flex justify-center items-center fixed inset-0 px-5">
                <Card className="w-full max-w-xl mx-auto">
                    <CardHeader className="flex flex-col gap-1 px-6 py-5">
                        <h1 className="text-2xl font-bold">Login</h1>
                        <p className="text-sm text-default-500">Enter your credentials to access your account</p>
                    </CardHeader>
                    <CardBody className="px-6 py-5">
                        <form className="space-y-5" onSubmit={handleSubmit(handleLogin)}>
                            <Input
                                required
                                label="Email"
                                size='sm'
                                type="string"
                                {...register('email')}
                                errorMessage={errors.email?.message as string} // Display the error message
                                isInvalid={!!errors.email} // Show invalid state if there's an error
                            />
                            <Input
                                required
                                label="Password"
                                size='sm'
                                type="password"
                                {...register('password')}
                                errorMessage={errors.password?.message as string} // Display the error message
                                isInvalid={!!errors.password} // Show invalid state if there's an error
                            />
                            <Button className='w-full rounded-lg py-6' type="submit">Sign In</Button>
                        </form>
                        <span className="text-red-600 mt-2 text-sm">{customError}</span>
                        <div className="flex justify-center mt-6">
                            <div className="text-center">
                                {customError ?
                                    <p className="text-sm">Forgot Password?</p> :
                                    <p>Don&apos;t have account ?  <Link className='' href="/auth/register">
                                        Register Now
                                    </Link></p>
                                }
                            </div>
                        </div>
                    </CardBody>
                </Card>
            </div>
        </>
    );
}
