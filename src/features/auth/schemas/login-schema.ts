import { AUTH_COPY } from "@/features/auth/constants/auth-content";
import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, AUTH_COPY.validation.emailRequired)
    .email(AUTH_COPY.validation.emailInvalid),
  password: z
    .string()
    .min(1, AUTH_COPY.validation.passwordRequired)
    .min(8, AUTH_COPY.validation.passwordMin),
  rememberMe: z.boolean(),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
