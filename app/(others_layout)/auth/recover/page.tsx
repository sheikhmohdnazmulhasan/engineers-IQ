'use client'

import React, { useState } from 'react';
import { motion } from "framer-motion";
import { Button, Card, CardBody, CardHeader, Input } from '@nextui-org/react';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { emailOrUsernameValidationSchema } from '@/validations/recover.validation';

const Recover = () => {
    const [err, setErr] = useState<string | null>('ddddd');
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(emailOrUsernameValidationSchema),
    });
    const onSubmit: SubmitHandler<FieldValues> = (data) => {

    };


    console.log(err);

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
                            <Button className='w-full rounded-lg py-6' type="submit">Search</Button>
                        </motion.div>
                    </form>
                </CardBody>
            </Card>
        </motion.div>
    );
};

export default Recover;
