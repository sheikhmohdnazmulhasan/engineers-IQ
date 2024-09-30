import { z } from "zod";

export const userRegistrationValidationSchema = z.object({
    name: z.string().nonempty("Name is required"),
    username: z.string()
        .nonempty("Username is required")
        .min(5, "Username must be at least 5 characters long") // Minimum of 5 characters
        .max(15, "Username must be at most 15 characters")
        .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores") // No special characters except underscore
        .transform((val) => val.trim()), // Trim whitespace
    email: z.string()
        .nonempty("Email is required")
        .email("Invalid email format"),
    password: z.string()
        .nonempty("Password is required")
        .min(6, "Password must be at least 6 characters long"),
    password2: z.string()
        .nonempty("Please confirm your password"),
}).refine(data => data.password === data.password2, {
    path: ["password2"],
    message: "Passwords do not match",
});
