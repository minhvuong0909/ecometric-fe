import { Navigate, createBrowserRouter, RouterProvider } from "react-router";
import { APP_ROUTE_CONFIG } from "@/features/app/app-route-config";
import { APP_PAGE_REGISTRY } from "@/features/app/app-page-registry";
import { AccountPage } from "@/features/app/pages/account-page";
import { ChangePasswordPage } from "@/features/app/pages/change-password-page";
import {
  GuestOnly,
  RequireAuth,
} from "@/features/auth/components/route-guards";
import { BusinessCreatePage } from "@/features/businesses/pages/business-create-page";
import { BusinessDetailPage } from "@/features/businesses/pages/business-detail-page";
import { BusinessEditPage } from "@/features/businesses/pages/business-edit-page";
import { BusinessesPage } from "@/features/businesses/pages/businesses-page";
import { ForgotPasswordPage } from "@/features/auth/pages/forgot-password-page";
import { LoginPage } from "@/features/auth/pages/login-page";
import { RegisterPage } from "@/features/auth/pages/register-page";
import { PublicWebsitePage } from "@/features/marketing/pages/public-website-page";
import { AppLayout } from "@/layouts/app-layout";
import { RootLayout } from "@/layouts/root-layout";
import { ROUTES } from "@/shared/constants/routes";

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
        path: "forgot-password",
        element: <ForgotPasswordPage />,
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
            path: "account",
            element: <AccountPage />,
          },
          {
            path: "account/change-password",
            element: <ChangePasswordPage />,
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
