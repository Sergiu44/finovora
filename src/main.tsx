import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/index.css";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import Providers from "./context/Providers";
import { Toaster } from "./components/ui/sonner";
import { ThemeProvider } from "./context/ThemeProvider";

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Providers>
      <ThemeProvider>
        <RouterProvider router={router} />
        <Toaster expand={true} />
      </ThemeProvider>
    </Providers>
  </StrictMode>
);
