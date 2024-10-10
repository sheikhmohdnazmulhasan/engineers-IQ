import { z } from 'zod';

export const emailOrUsernameValidationSchema = z.object({
    query: z.string().refine((value) => {
        const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        if (isEmail) return true;
        return value.length >= 5 && value.length <= 15 && /^[a-zA-Z0-9_]+$/.test(value);
    }, {
        message: 'Invalid username or email. Username must be 5-15 characters long, and only contain letters, numbers, and underscores.'
    })
});


export const passwordSetValidationSchema = z.object({
    password1: z.string()
        .nonempty('New Password is required')
        .min(6, "Password must be at least 6 characters long"),

    password2: z.string()
        .nonempty('Please confirm your password')
}).refine(data => data.password1 === data.password2, {
    path: ['password2'],
    message: "Passwords do not match",
})