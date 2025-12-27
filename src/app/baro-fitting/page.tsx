"use client";

import { AuthGuard } from "../../components/AuthGuard/AuthGuard";
import BaroFittingPage from "../../pages/baroFitting/BaroFittingPage";

export default function BaroFittingPageRoute() {
  return (
    <AuthGuard>
      <BaroFittingPage />
    </AuthGuard>
  );
}

