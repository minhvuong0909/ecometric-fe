import { z } from "zod";
import { BUSINESSES_COPY } from "@/features/businesses/constants/businesses-copy";

const v = BUSINESSES_COPY.validation;


export const inviteMemberFormSchema = z.object({
  email: z.string().min(1, v.emailRequired).email(v.emailInvalid),
  role: z.enum(["COMPANY_ADMIN", "BRANCH_MANAGER", "STAFF", "VIEWER"]),
});

export const acceptInvitationFormSchema = z.object({
  fullName: z.string().trim().optional(),
  password: z
    .string()
    .optional()
    .refine((val) => !val || val.length >= 8, {
      message: "Mật khẩu tối thiểu 8 ký tự.",
    }),
});

export type InviteMemberFormValues = z.infer<typeof inviteMemberFormSchema>;
export type AcceptInvitationFormValues = z.infer<
  typeof acceptInvitationFormSchema
>;
