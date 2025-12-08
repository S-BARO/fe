import { createBrowserRouter } from "react-router";
import HomePage from "../pages/home/HomePage";
import ProductDetailPage from "../pages/productDetail/ProductDetailPage";
import SwapPage from "../pages/swap/SwapPage";
import LookDetailPage from "../pages/swap/LookDetailPage";
import LoginPage from "../pages/login/LoginPage";
import KakaoCallbackPage from "../pages/login/KakaoCallbackPage";
import MyPage from "../pages/my/MyPage";
import BaroFittingPage from "../pages/baroFitting/BaroFittingPage";
import CartPage from "../pages/cart/CartPage";
import OrderConfirmPage from "../pages/cart/OrderConfirmPage";
import OrderSuccessPage from "../pages/cart/OrderSuccessPage";
import MyOrdersPage from "../pages/my/MyOrdersPage";
import OrderDetailPage from "../pages/my/OrderDetailPage";
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
        path: "look/:id",
        element: (
          <AuthGuard>
            <LookDetailPage />
          </AuthGuard>
        ),
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
        path: "baro-fitting",
        element: (
          <AuthGuard>
            <BaroFittingPage />
          </AuthGuard>
        ),
      },
      {
        path: "cart",
        element: (
          <AuthGuard>
            <CartPage />
          </AuthGuard>
        ),
      },
      {
        path: "order/confirm",
        element: (
          <AuthGuard>
            <OrderConfirmPage />
          </AuthGuard>
        ),
      },
      {
        path: "order/success",
        element: (
          <AuthGuard>
            <OrderSuccessPage />
          </AuthGuard>
        ),
      },
      {
        path: "my/orders",
        element: (
          <AuthGuard>
            <MyOrdersPage />
          </AuthGuard>
        ),
      },
      {
        path: "my/orders/:orderId",
        element: (
          <AuthGuard>
            <OrderDetailPage />
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
