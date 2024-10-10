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