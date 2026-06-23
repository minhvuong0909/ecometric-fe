import { createBrowserRouter, RouterProvider } from "react-router";
import { RootLayout } from "@/layouts/root-layout";
import { LoginPage } from "@/features/auth/pages/login-page";
import { HomePage } from "@/features/home/pages/home-page";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
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
