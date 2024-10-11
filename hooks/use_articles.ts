import axios, { AxiosError } from "axios";
import useSWR from "swr";

import { IArticleResponse, IPagination } from "@/interface/articles.response.interface";

interface UseArticleResponse {
    data: IArticleResponse | IArticleResponse[] | null;
    error: AxiosError | null;
    isLoading: boolean;
    pagination: IPagination;
    revalidate: () => void;
}

const useArticle = (query: {
    category?: string;
    author?: string;
    searchTerm?: string;
    isPremiumContent?: boolean;
    topic?: string;
    _id?: string;
    page?: number;
    limit?: number;
}): UseArticleResponse => {
    const fetcher = async (url: string): Promise<{ data: IArticleResponse | IArticleResponse[]; pagination: IPagination }> => {
        const response = await axios.get(url);
        return response.data;
    };

    // Build search params
    const buildUrlWithParams = () => {
        const params = new URLSearchParams();
        if (query.category) params.append("category", query.category);
        if (query.page) params.append("page", String(query.page));
        if (query.limit) params.append("limit", String(query.limit));
        if (query.author) params.append("author", query.author);
        if (query.topic) params.append("topic", query.topic);
        if (query.searchTerm) params.append("searchTerm", query.searchTerm);
        if (query.isPremiumContent !== undefined) params.append("isPremiumContent", String(query.isPremiumContent));
        if (query._id) params.append("_id", query._id);

        return `/api/articles?${params.toString()}`;
    };

    const { data, error, isValidating, mutate } = useSWR<{ data: IArticleResponse | IArticleResponse[]; pagination: IPagination }>(
        query ? buildUrlWithParams() : '/api/articles',
        fetcher
    );

    const isLoading = isValidating;

    return {
        data: data?.data || null,
        pagination: data?.pagination as IPagination,
        error: error as AxiosError,
        isLoading,
        revalidate: () => mutate(),
    };
};

export default useArticle;
