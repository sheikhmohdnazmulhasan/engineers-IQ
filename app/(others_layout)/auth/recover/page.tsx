'use client'

import React, { FormEvent, useState } from 'react';
import { motion } from "framer-motion";
import { Button, Card, CardBody, CardHeader, Input } from '@nextui-org/react';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { emailOrUsernameValidationSchema } from '@/validations/recover.validation';
import axiosInstance from '@/libs/axiosInstance';
import generateOTP from '@/utils/generateOTP';

const Recover = () => {
    const [err, setErr] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [emailSendStatus, setEmailSendStatus] = useState<boolean>(false);
    const OTP = generateOTP(8);
    const [otpError, setOtpError] = useState<boolean>(false);
    const [isLoading2, setIsLoading2] = useState<boolean>(false);

    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        resolver: zodResolver(emailOrUsernameValidationSchema),
    });

    const onSubmit: SubmitHandler<FieldValues> = async (data) => {
        setIsLoading(true);

        try {
            const res = await axiosInstance.get('/auth/recover', {
                params: {
                    query: data.query,
                },
            });

            if (res.status === 200) {
                console.log(OTP);

                setIsLoading(false);
                setEmailSendStatus(true);
                reset();

                // const EMAIL_PARAMS: INotificationEmail = {
                //     receiver_email: res.data.data.email,
                //     receiver_name: res.data.data.name,
                //     subject: 'Recover your account - EngineersIQ',
                //     description: `We received a request to recover access to your account. To proceed, please use the One-Time Password (OTP): ${OTP}

                //     Please note that this OTP is valid for a limited time and can only be used once. If you did not request this recovery, please ignore this email or contact our support team immediately.`
                // };

                // await sendNotificationEmail(EMAIL_PARAMS).then(() => {
                //     setIsLoading(false);
                //     setEmailSendStatus(true);
                //     reset();

                // }).catch(() => {
                //     setIsLoading(false);
                //     setErr('Failed to send email');
                // })
            }

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            setIsLoading(false);
            if (error.response?.status === 404) {
                setErr('No users were found based on your query!');
            } else if (error.response?.status === 500) {
                setErr('Something went wrong!');
            } else {
                setErr('Something bad happened!');
            }
        }
    };

    async function handleVerifyOTP(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setOtpError(false);

        const typedOtp = (event.target as HTMLFormElement).otp.value;

        if (typedOtp !== OTP) {
            setOtpError(true);
            return
        };

        // pass, create a token and set to user document

    }

    if (!emailSendStatus) {
        return (
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
                            Recover Your Account
                        </motion.h1>
                        <motion.p
                            animate={{ y: 0, opacity: 1 }}
                            className="text-sm text-default-500"
                            initial={{ y: -10, opacity: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            Please help us with some of your personal info!
                        </motion.p>
                    </CardHeader>
                    <CardBody className="px-6 py-5">
                        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
                            <motion.div
                                animate={{ x: 0, opacity: 1 }}
                                initial={{ x: -20, opacity: 0 }}
                                transition={{ delay: 0.4 }}
                            >
                                <Input
                                    {...register('query', {
                                        onChange: () => {
                                            if (err) {
                                                setErr(null)
                                            }
                                        }
                                    })}
                                    errorMessage={(errors.query?.message || err) as string}
                                    isInvalid={!!errors.query || !!err}
                                    label="Email or Username"
                                    size='sm'
                                    type="text"
                                />
                            </motion.div>
                            <motion.div
                                animate={{ y: 0, opacity: 1 }}
                                initial={{ y: 20, opacity: 0 }}
                                transition={{ delay: 0.6 }}
                            >
                                <Button className='w-full rounded-lg py-6' isLoading={isLoading} type="submit">Search</Button>
                            </motion.div>
                        </form>
                    </CardBody>
                </Card>
            </motion.div>
        )
    };

    if (emailSendStatus) {
        return (
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
                            Enter Oen Time Password
                        </motion.h1>
                        <motion.p
                            animate={{ y: 0, opacity: 1 }}
                            className="text-sm text-default-500"
                            initial={{ y: -10, opacity: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            Please check your email; We have sent you an OTP
                        </motion.p>
                    </CardHeader>
                    <CardBody className="px-6 py-5">
                        <form className="space-y-5" onSubmit={handleVerifyOTP}>
                            <motion.div
                                animate={{ x: 0, opacity: 1 }}
                                initial={{ x: -20, opacity: 0 }}
                                transition={{ delay: 0.4 }}
                            >
                                <Input
                                    errorMessage='OTP did not match!'
                                    isInvalid={otpError}
                                    label="OTP"
                                    name='otp'
                                    size='sm'
                                    type="text"
                                />
                            </motion.div>
                            <motion.div
                                animate={{ y: 0, opacity: 1 }}
                                initial={{ y: 20, opacity: 0 }}
                                transition={{ delay: 0.6 }}
                            >
                                <Button className='w-full rounded-lg py-6' type="submit">Verify</Button>
                            </motion.div>
                        </form>
                    </CardBody>
                </Card>
            </motion.div>
        )
    }
};

export default Recover;
