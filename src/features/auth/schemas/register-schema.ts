import { AUTH_COPY } from "@/features/auth/constants/auth-content";
import { z } from "zod";

export const registerSchema = z.object({
  fullName: z.string().min(1, AUTH_COPY.validation.fullNameRequired),
  email: z
    .string()
    .min(1, AUTH_COPY.validation.emailRequired)
    .email(AUTH_COPY.validation.emailInvalid),
  password: z
    .string()
    .min(1, AUTH_COPY.validation.passwordRequired)
    .min(8, AUTH_COPY.validation.passwordMin),
});

export type RegisterFormValues = z.infer<typeof registerSchema>;
