import axios, { AxiosError } from "axios";
import useSWR from "swr";

import { IArticleResponse } from "@/interface/articles.response.interface";

interface UseArticleResponse {
    data: IArticleResponse | IArticleResponse[] | null;
    error: AxiosError | null;
    isLoading: boolean;
    revalidate: () => void;
}

const useArticle = (query: {
    category?: string;
    author?: string;
    searchTerm?: string;
    isPremiumContent?: boolean;
    _id?: string;
}): UseArticleResponse => {
    const fetcher = async (url: string): Promise<IArticleResponse | IArticleResponse[]> => {
        const response = await axios.get(url);
        return response.data.data;
    };

    // Build search params
    const buildUrlWithParams = () => {
        const params = new URLSearchParams();
        if (query.category) params.append("category", query.category);
        if (query.author) params.append("author", query.author);
        if (query.searchTerm) params.append("searchTerm", query.searchTerm);
        if (query.isPremiumContent !== undefined) params.append("isPremiumContent", String(query.isPremiumContent));
        if (query._id) params.append("_id", query._id);

        return `/api/articles?${params.toString()}`;
    };

    const { data, error, isValidating, mutate } = useSWR<IArticleResponse | IArticleResponse[]>(
        query ? buildUrlWithParams() : null,
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

export default useArticle;
