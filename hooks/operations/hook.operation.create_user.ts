import { useMutation } from "@tanstack/react-query";
import { FieldValues } from "react-hook-form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { registerUser } from "@/services/auth.services";

export function useUserRegistration(email: string) {
    const router = useRouter();

    return useMutation({
        mutationKey: ['USER_REGISTRATION'],
        mutationFn: async (userData: FieldValues) => await registerUser(userData),
        onSuccess: () => {
            router.push(`/auth/verify?email=${email}`);
        },
        onError: (error) => {
            toast.error(error.message);
        }
    });
};