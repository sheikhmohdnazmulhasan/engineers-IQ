'use client'

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

import Loading from "@/components/loading";

const Welcome = () => {
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    return (
        <div className="">
            {token}
        </div>
    );
};


export default function welcomeWrapper() {
    return (
        <Suspense fallback={<Loading />}>
            <Welcome />
        </Suspense>
    );
}