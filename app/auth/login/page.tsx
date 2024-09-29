'use client'

import { Button, Card, CardBody, CardHeader, Input, Link } from "@nextui-org/react"

export default function LoginForm() {

    return (
        <Card className="w-full max-w-2xl mx-auto mt-10 md:mt-16 lg:mt-20">
            <CardHeader className="flex flex-col gap-1 px-6 py-5">
                <h1 className="text-2xl font-bold">Login</h1>
                <p className="text-sm text-default-500">Enter your credentials to access your account</p>
            </CardHeader>
            <CardBody className="px-6 py-5">
                <form className="space-y-5">
                    <Input label="Email" size='sm' type="email" />
                    <Input label="Password" size='sm' type="password" />
                    <Button className='w-full rounded-lg py-6'>Sign In</Button>
                </form>
                <div className="flex justify-center mt-6">
                    {/* <Link className='text-default-foreground' href="#" size="sm">
                        Forgot password?
                    </Link> */}

                    <div className="">
                        Don&apos;t have account?  <Link className='' href="">
                            Register Now
                        </Link>
                    </div>
                </div>
            </CardBody>
        </Card>
    )
}