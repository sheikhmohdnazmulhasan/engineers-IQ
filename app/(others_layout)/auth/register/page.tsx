'use client'

import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Card, CardBody, CardHeader, Input, Link } from "@nextui-org/react"
import { useForm } from "react-hook-form";
import { z } from "zod";
import { motion } from "framer-motion";

import { userRegistrationValidationSchema } from "@/validations/users.validations";
import { useUserRegistration } from "@/hooks/operations/hook.operation.create_user";
import Loading from "@/components/loading";

export default function Register() {
    const { register, handleSubmit, formState: { errors }, watch } = useForm({
        resolver: zodResolver(userRegistrationValidationSchema)
    });

    const watchedEmail = watch('email');

    const { mutate: handleCreateNewUser, isPending } = useUserRegistration(watchedEmail);

    type formData = z.infer<typeof userRegistrationValidationSchema>
    const handleRegister = (data: formData) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password2, ...rest } = data;
        handleCreateNewUser(rest);
    }

    return (
        <>
            {isPending && <Loading />}
            <motion.div
                animate={{ opacity: 1 }}
                className="min-h-screen flex justify-center items-center inset-0 px-5"
                exit={{ opacity: 0 }}
                initial={{ opacity: 0 }}
            >
                <Card className="w-full max-w-2xl mx-auto">
                    <CardHeader className="flex flex-col gap-1 px-6 py-5">
                        <motion.h1
                            animate={{ y: 0, opacity: 1 }}
                            className="text-2xl font-bold"
                            initial={{ y: -20, opacity: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            Register New Account
                        </motion.h1>
                        <motion.p
                            animate={{ y: 0, opacity: 1 }}
                            className="text-sm text-default-500"
                            initial={{ y: -10, opacity: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            Create Your Account and Start Writing
                        </motion.p>
                    </CardHeader>
                    <CardBody className="px-6 py-5">
                        <form className="space-y-5" onSubmit={handleSubmit((data) => handleRegister(data as formData))}>
                            <motion.div
                                animate={{ x: 0, opacity: 1 }}
                                className="md:flex md:gap-3 space-y-5 md:space-y-0"
                                initial={{ x: -20, opacity: 0 }}
                                transition={{ delay: 0.4 }}
                            >
                                <Input required className="flex-1" label="Name" size='sm' type="text" {...register('name')}
                                    errorMessage={errors.name?.message as string}
                                    isInvalid={!!errors.name}
                                />
                                <Input required className="flex-1" label="Username" max={15} size='sm' type="text" {...register('username')}
                                    errorMessage={errors.username?.message as string}
                                    isInvalid={!!errors.username}
                                />
                            </motion.div>
                            <motion.div
                                animate={{ x: 0, opacity: 1 }}
                                initial={{ x: -20, opacity: 0 }}
                                transition={{ delay: 0.5 }}
                            >
                                <Input required label="Email" size='sm' type="text" {...register('email')}
                                    errorMessage={errors.email?.message as string}
                                    isInvalid={!!errors.email}
                                />
                            </motion.div>
                            <motion.div
                                animate={{ x: 0, opacity: 1 }}
                                initial={{ x: -20, opacity: 0 }}
                                transition={{ delay: 0.6 }}
                            >
                                <Input required label="Password" size='sm' type="password" {...register('password')}
                                    errorMessage={errors.password?.message as string}
                                    isInvalid={!!errors.password}
                                />
                            </motion.div>
                            <motion.div
                                animate={{ x: 0, opacity: 1 }}
                                initial={{ x: -20, opacity: 0 }}
                                transition={{ delay: 0.7 }}
                            >
                                <Input required label="Confirm Password" size='sm' type="password" {...register('password2')}
                                    errorMessage={errors.password2?.message as string}
                                    isInvalid={!!errors.password2}
                                />
                            </motion.div>
                            <motion.div
                                animate={{ y: 0, opacity: 1 }}
                                initial={{ y: 20, opacity: 0 }}
                                transition={{ delay: 0.8 }}
                            >
                                <Button className='w-full rounded-lg py-6' type="submit">Register</Button>
                            </motion.div>
                        </form>
                        <motion.div
                            animate={{ opacity: 1 }}
                            className="flex justify-center mt-6"
                            initial={{ opacity: 0 }}
                            transition={{ delay: 0.9 }}
                        >
                            <div className="">
                                Already have account?  <Link className='' href="/auth/login">
                                    Sign In
                                </Link>
                            </div>
                        </motion.div>
                    </CardBody>
                </Card>
            </motion.div>
        </>
    )
}