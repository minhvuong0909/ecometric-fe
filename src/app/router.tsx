import { Navigate, createBrowserRouter, RouterProvider } from "react-router";
import { APP_ROUTE_CONFIG } from "@/features/app/app-route-config";
import { APP_PAGE_REGISTRY } from "@/features/app/app-page-registry";
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
        element: <LoginPage />,
      },
      {
        path: "register",
        element: <RegisterPage />,
      },
      {
        path: "forgot-password",
        element: <ForgotPasswordPage />,
      },
      {
        path: "app",
        element: <AppLayout />,
        children: [
          {
            index: true,
            element: <Navigate to={ROUTES.app.dashboard} replace />,
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
