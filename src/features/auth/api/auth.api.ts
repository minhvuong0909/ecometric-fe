import type { LoginRequest, LoginResponse } from "@/features/auth/types/login.types";

const MOCK_DELAY_MS = 1200;

/**
 * Mock login — replace with real API call when backend is ready.
 */
export async function login(request: LoginRequest): Promise<LoginResponse> {
  await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY_MS));

  if (request.email === "fail@company.com") {
    throw new Error("Invalid email or password. Please try again.");
  }

  return {
    message: `Welcome back! Signed in as ${request.email}`,
  };
}
