"use client";
import axios, { AxiosError } from "axios";
import useSWR from "swr";

import { IWhoToFollowResponse } from "@/interface/who_to_follow.response.interface";

interface UseUserResponse {
    whoToFollow: IWhoToFollowResponse[] | null;
    error: AxiosError | null;
    isLoading: boolean;
}

const useWhoToFollow = (user: string): UseUserResponse => {

    const fetcher = async (url: string): Promise<IWhoToFollowResponse[]> => {
        const response = await axios.get(url);
        return response.data;
    };

    const { data, error, isValidating } = useSWR<IWhoToFollowResponse[]>(
        user ? `/api/follow?user=${user}` : null,
        fetcher
    );

    const isLoading = isValidating;

    return { whoToFollow: data || null, error: error as AxiosError, isLoading };
};

export default useWhoToFollow;
