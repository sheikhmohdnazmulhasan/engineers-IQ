import { IUserResponse } from "@/interface/user.response.interface";
import axios, { AxiosError } from "axios";
import useSWR from "swr";


interface UseUserResponse {
    data: IUserResponse[] | null;
    error: AxiosError | null;
    isLoading: boolean;
    revalidate: () => void;
}

const useAllUsers = (author: string): UseUserResponse => {
    const fetcher = async (url: string): Promise<IUserResponse[]> => {
        const response = await axios.get(url);
        return response.data.data;
    };

    const { data, error, isValidating, mutate } = useSWR<IUserResponse[]>(
        author ? `/api/analytics?_id=${author}` : null,
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
