'use client'

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { XCircle } from "lucide-react";
import { motion } from "framer-motion";
import { Button, Card, CardBody, CardHeader, Input } from "@nextui-org/react";

import Loading from "@/components/loading";
import { decrypt } from "@/utils/text_encryptor";

const Welcome = () => {
    const searchParams = useSearchParams();
    const token = searchParams.get('token');
    const decryptedBob = decrypt(token as unknown as string);
    const decryptedData = decryptedBob.split('+++');
    const currentTime = new Date();
    const expiry = new Date(decryptedData[1]);

    if (currentTime > expiry) {
        return (
            <div className="inset-0 flex items-center h-screen flex-col gap-3 justify-center">
                <XCircle color="red" size={50} />
                <h2>Token Expired</h2>
            </div>
        );

    } else {
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
                            Welcome Back
                        </motion.h1>
                        <motion.p
                            animate={{ y: 0, opacity: 1 }}
                            className="text-sm text-default-500"
                            initial={{ y: -10, opacity: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            We are glad to see that your account has been successfully recovered!
                        </motion.p>
                    </CardHeader>
                    <CardBody className="px-6 py-5">
                        <form className="space-y-5">
                            <motion.div
                                animate={{ x: 0, opacity: 1 }}
                                initial={{ x: -20, opacity: 0 }}
                                transition={{ delay: 0.4 }}
                            >
                                <Input
                                    // errorMessage={errors.query?.message as string}
                                    // isInvalid={!!errors.query}
                                    label="New Password"
                                    size='sm'
                                    type="Password"
                                />
                            </motion.div>

                            <motion.div
                                animate={{ x: 0, opacity: 1 }}
                                initial={{ x: -20, opacity: 0 }}
                                transition={{ delay: 0.5 }}
                            >
                                <Input
                                    // errorMessage={errors.query?.message as string}
                                    // isInvalid={!!errors.query}
                                    label="Confirm New Password"
                                    size='sm'
                                    type="password"
                                />
                            </motion.div>

                            <motion.div
                                animate={{ y: 0, opacity: 1 }}
                                initial={{ y: 20, opacity: 0 }}
                                transition={{ delay: 0.6 }}
                            >
                                <Button className='w-full rounded-lg py-6' type="submit">Update Password</Button>
                            </motion.div>
                        </form>
                    </CardBody>
                </Card>
            </motion.div>
        )
    }
};


export default function welcomeWrapper() {
    return (
        <Suspense fallback={<Loading />}>
            <Welcome />
        </Suspense>
    );
}