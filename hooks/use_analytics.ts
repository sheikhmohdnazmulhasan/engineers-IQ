import axios, { AxiosError } from "axios";
import useSWR from "swr";

import { IAnalyticsResponse } from "@/interface/analytics.response.interface";

interface UseUserResponse {
    data: IAnalyticsResponse | null;
    error: AxiosError | null;
    isLoading: boolean;
    revalidate: () => void;
}

const useAnalytics = (author: string): UseUserResponse => {
    const fetcher = async (url: string): Promise<IAnalyticsResponse> => {
        const response = await axios.get(url);
        return response.data.data;
    };

    const { data, error, isValidating, mutate } = useSWR<IAnalyticsResponse>(
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

export default useAnalytics;
