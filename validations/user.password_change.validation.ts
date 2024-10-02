import { z } from "zod";

export const userPasswordChangeValidationSchema = z.object({
    oldPassword: z.string()
        .nonempty('Old Password is required'),

    newPassword: z.string()
        .nonempty('New Password is required')
        .min(6, "Password must be at least 6 characters long"),

    newPassword2: z.string()
        .nonempty('Please confirm your password')
}).refine(data => data.newPassword === data.newPassword2, {
    path: ['newPassword2'],
    message: "Passwords do not match",
})