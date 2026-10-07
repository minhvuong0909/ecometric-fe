import { useMutation } from "@tanstack/react-query";
import { subscribeBusiness } from "@/features/businesses/api/businesses.api";
import type { SubscribeBusinessRequest } from "@/features/businesses/types/businesses.types";
export function useSubscribeBusiness() {
  return useMutation({ mutationFn: (body: SubscribeBusinessRequest) => subscribeBusiness(body) });
}
