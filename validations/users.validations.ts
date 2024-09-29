import { z } from 'zod';

export const userValidationSchema = z.object({
    name: z.string().min(1, { message: "Name is required" }).trim(),
    email: z.string().email({ message: "Invalid email address" }).trim().toLowerCase(),
    username: z.string()
        .min(1, { message: "Username is required" })
        .max(15, { message: "Username cannot exceed 15 characters" })
        .trim(),
    password: z.string().min(6, { message: "Password must be at least 6 characters long" }),
    isEmailVerified: z.boolean().default(false),
    isPremiumMember: z.boolean().default(false),
    role: z.enum(['admin', 'user'], { message: "Role must be 'admin' or 'user'" }).default('user'),
});
