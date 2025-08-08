import { createBrowserRouter } from "react-router";
import HomePage from "../pages/home/HomePage";
import ProductDetailPage from "../pages/productDetail/ProductDetailPage";
import SwapPage from "../pages/swap/SwapPage";
import LoginPage from "../pages/login/LoginPage";
import RootLayout from "./Layout/RootLayout";

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
        element: <SwapPage />,
      },
      { path: "/login", element: <LoginPage /> },
    ],
  },
]);
export default router;
