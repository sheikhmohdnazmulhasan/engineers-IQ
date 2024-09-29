'use client'

import { Button, Card, CardBody, CardHeader, Input, Link } from "@nextui-org/react"
import { FieldValues, SubmitHandler, useForm } from "react-hook-form"

export default function Login() {
    const { handleSubmit, register } = useForm();

    const handleLogin: SubmitHandler<FieldValues> = async (data) => {

        console.log(data);
    }

    return (
        <div className="min-h-screen flex justify-center items-center fixed inset-0 px-5">
            <Card className="w-full max-w-2xl mx-auto">
                <CardHeader className="flex flex-col gap-1 px-6 py-5">
                    <h1 className="text-2xl font-bold">Login</h1>
                    <p className="text-sm text-default-500">Enter your credentials to access your account</p>
                </CardHeader>
                <CardBody className="px-6 py-5">
                    <form className="space-y-5" onSubmit={handleSubmit(handleLogin)}>
                        <Input required label="Email" size='sm' type="email" {...register('email')} />
                        <Input required label="Password" size='sm' type="password" {...register('password')} />
                        <Button className='w-full rounded-lg py-6' type="submit">Sign In</Button>
                    </form>
                    <div className="flex justify-center mt-6">
                        {/* <Link className='text-default-foreground' href="#" size="sm">
                        Forgot password?
                    </Link> */}

                        <div className="">
                            Don&apos;t have account ?  <Link className='' href="/auth/register">
                                Register Now
                            </Link>
                        </div>
                    </div>
                </CardBody>
            </Card>
        </div>
    )
}