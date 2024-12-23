import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { FieldValues } from "react-hook-form";
import { toast } from "sonner";

import { updateArticle } from "@/services/article.services";

export function useUpdateArticle(username: string, postId: string, encryptedToken: string) {
    const router = useRouter();

    return useMutation({
        mutationKey: ['ARTICLE_CREATION'],
        mutationFn: async (payload: FieldValues) => await updateArticle(payload, postId, encryptedToken),
        onSuccess: () => {
            router.push(`/profile/${username}`);
        },
        onError: (error) => {
            toast.error(error.message);
        }
    })
}