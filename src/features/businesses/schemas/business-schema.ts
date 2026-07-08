import { z } from "zod";
import { BUSINESSES_COPY } from "@/features/businesses/constants/businesses-copy";

const v = BUSINESSES_COPY.validation;

const emptyToUndefined = (value: unknown) =>
  typeof value === "string" && value.trim() === "" ? undefined : value;

const optionalText = z.preprocess(
  emptyToUndefined,
  z.string().trim().min(1).optional(),
);

const optionalWebsite = z.preprocess(
  emptyToUndefined,
  z.string().trim().url(v.websiteInvalid).optional(),
);

const optionalCountry = z.preprocess(
  emptyToUndefined,
  z.string().trim().length(2, v.countryLength).optional(),
);

const slugField = z
  .string()
  .min(1, v.slugRequired)
  .pipe(z.string().regex(/^[a-z0-9-]+$/, v.slugInvalid));

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
