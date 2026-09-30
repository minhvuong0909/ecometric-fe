import { z } from "zod";
import { ONBOARDING_COPY } from "@/features/businesses/constants/businesses-copy";

export const subscribeBusinessFormSchema = z.object({
  name: z.string().min(1, ONBOARDING_COPY.nameRequired).min(2, ONBOARDING_COPY.nameMin),
  taxCode: z.string().trim().optional(),
  industry: z.string().trim().optional(),
});

export type SubscribeBusinessFormValues = z.infer<typeof subscribeBusinessFormSchema>;
