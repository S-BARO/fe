import { createBrowserRouter } from "react-router";
import HomePage from "../pages/home/HomePage";
import ProductDetailPage from "../pages/productDetail/ProductDetailPage";
import SwapPage from "../pages/swap/SwapPage";
import LoginPage from "../pages/login/LoginPage";
import KakaoCallbackPage from "../pages/login/KakaoCallbackPage";
import MyPage from "../pages/my/MyPage";
import LikePage from "../pages/like/LikePage";
import RootLayout from "./Layout/RootLayout";
import { AuthGuard } from "../components/AuthGuard/AuthGuard";

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
        path: "product/:id",
        element: <ProductDetailPage />,
      },
      {
        path: "swap",
        element: (
          <AuthGuard>
            <SwapPage />
          </AuthGuard>
        ),
      },
      {
        path: "like",
        element: (
          <AuthGuard>
            <LikePage />
          </AuthGuard>
        ),
      },
      { path: "login", element: <LoginPage /> },
      { path: "login/kakao/callback", element: <KakaoCallbackPage /> },
      {
        path: "my",
        element: (
          <AuthGuard>
            <MyPage />
          </AuthGuard>
        ),
      },
    ],
  },
]);
export default router;
