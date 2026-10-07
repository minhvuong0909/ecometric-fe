import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AppProviders } from "@/app/providers";
import { AppRouter } from "@/app/router";
import "@/styles/globals.css";
import "@/styles/surface-palette.css";
import "@/styles/brand-surfaces.css";
import "@/styles/workspace-surfaces.css";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element #root not found");
}

createRoot(rootElement).render(
  <StrictMode>
    <AppProviders>
      <AppRouter />
    </AppProviders>
  </StrictMode>,
);
