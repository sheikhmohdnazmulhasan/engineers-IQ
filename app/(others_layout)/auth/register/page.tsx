'use client'

import { Button, Card, CardBody, CardHeader, Input, Link } from "@nextui-org/react"

export default function Register() {

    return (
        <div className=" min-h-screen flex justify-center items-center fixed inset-0 px-5">
            <Card className="w-full max-w-2xl mx-auto">
                <CardHeader className="flex flex-col gap-1 px-6 py-5">
                    <h1 className="text-2xl font-bold">Register New Account</h1>
                    <p className="text-sm text-default-500">Create Your Account and Start Writing</p>
                </CardHeader>
                <CardBody className="px-6 py-5">
                    <form className="space-y-5">
                        <div className="md:flex md:gap-3 space-y-5 md:space-y-0">
                            <Input required className="flex-1" label="Name" size='sm' type="text" />
                            <Input required className="flex-1" label="Username" max={15} size='sm' type="text" />
                        </div>
                        <Input required label="Email" size='sm' type="email" />
                        <Input required label="Password" size='sm' type="password" />
                        <Input required label="Confirm Password" size='sm' type="password" />
                        <Button className='w-full rounded-lg py-6' type="submit">Register</Button>
                    </form>
                    <div className="flex justify-center mt-6">
                        <div className="">
                            Already have account?  <Link className='' href="/auth/login">
                                Sign In
                            </Link>
                        </div>
                    </div>
                </CardBody>
            </Card>
        </div>
    )
}