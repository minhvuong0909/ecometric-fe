import { z } from "zod";
import { BUSINESSES_COPY } from "@/features/businesses/constants/businesses-copy";

const v = BUSINESSES_COPY.validation;

const optionalText = z.string().trim().optional();

const optionalWebsite = z
  .string()
  .trim()
  .optional()
  .refine((val) => !val || z.string().url().safeParse(val).success, {
    message: v.websiteInvalid,
  });

const optionalCountry = z
  .string()
  .trim()
  .optional()
  .refine((val) => !val || val.length === 2, {
    message: v.countryLength,
  });

const slugField = z
  .string()
  .min(1, v.slugRequired)
  .regex(/^[a-z0-9-]+$/, v.slugInvalid);

export const createBusinessFormSchema = z.object({
  name: z.string().min(1, v.nameRequired).min(2, v.nameMin),
  slug: slugField,
  taxCode: optionalText,
  industry: optionalText,
  country: optionalCountry,
  timezone: optionalText,
  website: optionalWebsite,
  companyAdminEmail: z.string().min(1, v.emailRequired).email(v.emailInvalid),
  companyAdminFullName: optionalText,
  branchName: optionalText,
  branchCode: optionalText,
  branchAddress: optionalText,
  branchCountry: optionalCountry,
});

export const updateBusinessFormSchema = z.object({
  name: z.string().min(1, v.nameRequired).min(2, v.nameMin),
  slug: slugField,
  taxCode: optionalText,
  industry: optionalText,
  country: z.string().trim().length(2, v.countryLength),
  timezone: z.string().trim().min(1),
  website: optionalWebsite,
  status: z.enum(["ACTIVE", "SUSPENDED", "ARCHIVED"]),
});

export type CreateBusinessFormValues = z.infer<typeof createBusinessFormSchema>;
export type UpdateBusinessFormValues = z.infer<typeof updateBusinessFormSchema>;
