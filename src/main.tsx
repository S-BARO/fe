import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router";

import router from "./app/routes";
import { AuthProvider } from "./contexts/auth";
import "./index.css";

// MSW 개발 환경에서만 서비스 워커 시작
// if (import.meta.env.DEV) {
//   const { worker } = await import("./libs/browser");
//   await worker.start();
// }

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>
);
