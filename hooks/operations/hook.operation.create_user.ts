
import { useMutation } from "@tanstack/react-query";
import { FieldValues } from "react-hook-form";
import { toast } from "sonner";

import { registerUser } from "@/services/auth.services";

export function useUserRegistration() {
    return useMutation({
        mutationKey: ['USER_REGISTRATION'],
        mutationFn: async (userData: FieldValues) => await registerUser(userData),
        onSuccess: () => {
            toast.success('User Registration Successful')
        },
        onError: (error) => {
            toast.error(error.message);
        }
    });
};