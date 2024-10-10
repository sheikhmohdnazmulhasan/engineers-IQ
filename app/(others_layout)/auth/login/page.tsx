'use client'

import { Button, Card, CardBody, CardHeader, Input, Link } from "@nextui-org/react"
import { zodResolver } from "@hookform/resolvers/zod";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

import { loginValidationSchema } from "@/validations/login.validation";
import Loading from "@/components/loading";
import { encrypt } from "@/utils/text_encryptor";

function Login() {
    const [customError, setCustomError] = useState<null | string>(null)
    const [loading, setLoading] = useState<boolean>(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirect = searchParams.get('redirect');

    const { handleSubmit, register, formState: { errors } } = useForm({
        resolver: zodResolver(loginValidationSchema) // Using Zod for form validation
    });

    const handleLogin: SubmitHandler<FieldValues> = async (data) => {
        setCustomError(null);
        setLoading(true);

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/api/auth/login`, {
                method: 'POST',
                body: JSON.stringify({
                    email: data.email,
                    password: data.password,
                }),
                headers: { "Content-Type": "application/json" }
            });

            if (!res.ok) {
                setCustomError('Invalid Email or Password!')
                setLoading(false);
                return
            }

            // user Lagged in
            const signed_token = encrypt(data.email);
            localStorage.setItem('signed_token', signed_token);
            setCustomError(null);
            setLoading(false);

            if (redirect) {
                router.push(redirect);
            } else {
                router.push('/');
            }

        } catch (error) {
            setCustomError('Something Bad Happened!')
            setLoading(false);
        };
    };

    return (
        <>
            {loading && <Loading />}
            <motion.div
                animate={{ opacity: 1 }}
                className="min-h-screen flex justify-center items-center inset-0 px-5"
                exit={{ opacity: 0 }}
                initial={{ opacity: 0 }}
            >
                <Card className="w-full max-w-xl mx-auto">
                    <CardHeader className="flex flex-col gap-1 px-6 py-5">
                        <motion.h1
                            animate={{ y: 0, opacity: 1 }}
                            className="text-2xl font-bold"
                            initial={{ y: -20, opacity: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            Login
                        </motion.h1>
                        <motion.p
                            animate={{ y: 0, opacity: 1 }}
                            className="text-sm text-default-500"
                            initial={{ y: -10, opacity: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            Enter your credentials to access your account
                        </motion.p>
                    </CardHeader>
                    <CardBody className="px-6 py-5">
                        <form className="space-y-5" onSubmit={handleSubmit(handleLogin)}>
                            <motion.div
                                animate={{ x: 0, opacity: 1 }}
                                initial={{ x: -20, opacity: 0 }}
                                transition={{ delay: 0.4 }}
                            >
                                <Input
                                    required
                                    label="Email"
                                    size='sm'
                                    type="string"
                                    {...register('email')}
                                    errorMessage={errors.email?.message as string}
                                    isInvalid={!!errors.email}
                                />
                            </motion.div>
                            <motion.div
                                animate={{ x: 0, opacity: 1 }}
                                initial={{ x: -20, opacity: 0 }}
                                transition={{ delay: 0.5 }}
                            >
                                <Input
                                    required
                                    label="Password"
                                    size='sm'
                                    type="password"
                                    {...register('password')}
                                    errorMessage={errors.password?.message as string}
                                    isInvalid={!!errors.password}
                                />
                            </motion.div>
                            <motion.div
                                animate={{ y: 0, opacity: 1 }}
                                initial={{ y: 20, opacity: 0 }}
                                transition={{ delay: 0.6 }}
                            >
                                <Button className='w-full rounded-lg py-6' type="submit">Sign In</Button>
                            </motion.div>
                        </form>
                        <AnimatePresence>
                            {customError && (
                                <motion.span
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-red-600 mt-2 text-sm"
                                    exit={{ opacity: 0, y: -5 }}
                                    initial={{ opacity: 0, y: 5 }}
                                >
                                    {customError}
                                </motion.span>
                            )}
                        </AnimatePresence>
                        <motion.div
                            animate={{ opacity: 1 }}
                            className="flex justify-center mt-6"
                            initial={{ opacity: 0 }}
                            transition={{ delay: 0.7 }}
                        >
                            <div className="text-center">
                                {customError ?
                                    <Link className='' href="/auth/recover">
                                        Forgot Password?
                                    </Link> :
                                    <p>Don&apos;t have account ?  <Link className='' href="/auth/register">
                                        Register Now
                                    </Link></p>
                                }
                            </div>
                        </motion.div>
                    </CardBody>
                </Card>
            </motion.div>
        </>
    );
}

export default function LoginWrapper() {
    return (
        <Suspense fallback={<Loading />}>
            <Login />
        </Suspense>
    );
}