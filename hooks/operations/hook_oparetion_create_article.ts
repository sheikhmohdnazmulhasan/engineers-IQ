import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { FieldValues } from "react-hook-form";
import { toast } from "sonner";

import { createArticle } from "@/services/article.services";

export function useCreateArticle(username: string) {
    const router = useRouter();

    return useMutation({
        mutationKey: ['ARTICLE_CREATION'],
        mutationFn: async (payload: FieldValues) => await createArticle(payload),
        onSuccess: () => {
            router.push(`/profile/${username}`);
        },
        onError: (error) => {
            toast.error(error.message);
        }
    })
}