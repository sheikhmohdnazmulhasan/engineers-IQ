import axios, { AxiosError } from "axios";
import useSWR from "swr";

import { IUserResponse } from "@/interface/user.response.interface";

interface IPagination {
    totalUsers: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
}

interface APIResponse {
    data: IUserResponse[] | null;
    pagination: IPagination;
}

export interface UseUserResponse {
    data: APIResponse | null;
    error: AxiosError | null;
    isLoading: boolean;
    revalidate: () => void;
}

const useAllUsers = (page: number = 1, limit: number = 10): UseUserResponse => {
    // Adjusted fetcher to handle the expected response structure
    const fetcher = async (url: string): Promise<APIResponse> => {
        const response = await axios.get(url);
        return response.data;
    };

    const { data, error, isValidating, mutate } = useSWR<APIResponse>(
        `/api/analytics/admin/users?page=${page}&limit=${limit}`,
        fetcher
    );

    const isLoading = isValidating;

    return {
        data: data || null,
        error: error as AxiosError,
        isLoading,
        revalidate: () => mutate(),
    };
};

export default useAllUsers;
