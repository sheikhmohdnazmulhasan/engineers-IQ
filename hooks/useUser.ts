"use client";
import axios, { AxiosError } from "axios";
import useSWR from "swr";
import { useEffect, useState } from "react";

import { IUserResponse } from "@/interface/user.response.interface";
import { decrypt } from "@/utils/text_encryptor";

interface UseUserResponse {
    currentUser: IUserResponse | null;
    error: AxiosError | null;
    isLoading: boolean;
    revalidate: () => void;
}

const useUser = (): UseUserResponse => {
    const [signedToken, setSignedToken] = useState<string | null>(null);

    // Ensure access localStorage only in the browser
    useEffect(() => {
        if (typeof window !== "undefined") {
            const token = localStorage.getItem('signed_token');
            if (token) {
                setSignedToken(decrypt(token));
            }
        }
    }, []);

    const fetcher = async (url: string): Promise<IUserResponse> => {
        const response = await axios.get(url);
        return response.data.data;
    };

    const { data, error, isValidating, mutate } = useSWR<IUserResponse>(
        signedToken ? `/api/users?email=${signedToken}` : null,
        fetcher
    );

    const isLoading = isValidating;

    return { currentUser: data || null, error: error as AxiosError, isLoading, revalidate: () => mutate() };
};

export default useUser;
