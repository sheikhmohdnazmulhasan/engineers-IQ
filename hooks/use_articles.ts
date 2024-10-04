
import axios, { AxiosError } from "axios";
import useSWR from "swr";

import { IUserResponse } from "@/interface/user.response.interface";

interface UseUserResponse {
    profile: IUserResponse | null;
    error: AxiosError | null;
    isLoading: boolean;
    revalidate: () => void;
}

const useArticle = (user: string): UseUserResponse => {
    const fetcher = async (url: string): Promise<IUserResponse> => {
        const response = await axios.get(url);
        return response.data.data;
    };

    const { data, error, isValidating, mutate } = useSWR<IUserResponse>(
        user ? `/api/users?username=${user}` : null,
        fetcher
    );

    const isLoading = isValidating;

    return {
        profile: data || null,
        error: error as AxiosError,
        isLoading,
        revalidate: () => mutate(),
    };
};

export default useArticle;
