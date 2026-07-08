import { AUTH_COPY } from "@/features/auth/constants/auth-content";
import { z } from "zod";

export const changePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, AUTH_COPY.validation.currentPasswordRequired),
    newPassword: z.string().min(8, AUTH_COPY.validation.newPasswordMin),
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: AUTH_COPY.validation.newPasswordSame,
    path: ["newPassword"],
  });

export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;
