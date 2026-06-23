import { createBrowserRouter, RouterProvider } from "react-router";
import { RootLayout } from "@/layouts/root-layout";
import { PublicWebsitePage } from "@/features/marketing/pages/public-website-page";
import { LoginPage } from "@/features/auth/pages/login-page";

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
    ],
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
