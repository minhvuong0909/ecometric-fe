import { Navigate, createBrowserRouter, RouterProvider } from "react-router";
import { APP_ROUTE_CONFIG } from "@/features/app/app-route-config";
import { APP_PAGE_REGISTRY } from "@/features/app/app-page-registry";
import {
  GuestOnly,
  RequireAuth,
} from "@/features/auth/components/route-guards";
import { AcceptInvitationPage } from "@/features/businesses/pages/accept-invitation-page";
import { BusinessCreatePage } from "@/features/businesses/pages/business-create-page";
import { BusinessDetailPage } from "@/features/businesses/pages/business-detail-page";
import { BusinessEditPage } from "@/features/businesses/pages/business-edit-page";
import { BusinessInvitationsPage } from "@/features/businesses/pages/business-invitations-page";
import { BusinessMembersPage } from "@/features/businesses/pages/business-members-page";
import { BusinessesPage } from "@/features/businesses/pages/businesses-page";
import { ForgotPasswordPage } from "@/features/auth/pages/forgot-password-page";
import { LoginPage } from "@/features/auth/pages/login-page";
import { RegisterPage } from "@/features/auth/pages/register-page";
import { PublicWebsitePage } from "@/features/marketing/pages/public-website-page";
import { AppLayout } from "@/layouts/app-layout";
import { RootLayout } from "@/layouts/root-layout";
import { ROUTES } from "@/shared/constants/routes";

import { SsoCallbackPage } from "@/features/auth/pages/sso-callback-page";

function getAppScreenElement(screenId: keyof typeof APP_PAGE_REGISTRY) {
  const Page = APP_PAGE_REGISTRY[screenId];
  if (!Page) {
    throw new Error(`Unknown app screen id: ${screenId}`);
  }
  return <Page />;
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <PublicWebsitePage />,
      },
      {
        path: "login",
        element: (
          <GuestOnly>
            <LoginPage />
          </GuestOnly>
        ),
      },
      {
        path: "register",
        element: (
          <GuestOnly>
            <RegisterPage />
          </GuestOnly>
        ),
      },
      {
        path: "sso-callback",
        element: <SsoCallbackPage />,
      },
      {
        path: "forgot-password",
        element: <ForgotPasswordPage />,
      },
      {
        path: "invitations/accept",
        element: <AcceptInvitationPage />,
      },
      {
        path: "app",
        element: (
          <RequireAuth>
            <AppLayout />
          </RequireAuth>
        ),
        children: [
          {
            index: true,
            element: <Navigate to={ROUTES.app.dashboard} replace />,
          },
          {
            path: "businesses",
            element: <BusinessesPage />,
          },
          {
            path: "businesses/new",
            element: <BusinessCreatePage />,
          },
          {
            path: "businesses/:id",
            element: <BusinessDetailPage />,
          },
          {
            path: "businesses/:id/edit",
            element: <BusinessEditPage />,
          },
          {
            path: "businesses/:id/members",
            element: <BusinessMembersPage />,
          },
          {
            path: "businesses/:id/invitations",
            element: <BusinessInvitationsPage />,
          },
          ...APP_ROUTE_CONFIG.map(({ path, screenId }) => ({
            path,
            element: getAppScreenElement(screenId),
          })),
        ],
      },
    ],
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
