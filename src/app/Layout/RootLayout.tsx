  import { Outlet, useLocation } from "react-router";
  import Header from "../../components/Header/Header";
  import GNB from "../../components/GNB/GNB";
  import styled from "@emotion/styled";
  import HomeFilter from "../../components/Filter/HomeFilter";
  import SwapFilter from "../../components/Filter/SwapFilter";

  const ScrollArea = styled.div`
    max-width: 390px;
    margin: 0 auto;
    flex: 1;
    overflow-y: auto;
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* IE, Edge */
    &::-webkit-scrollbar {
      display: none; /* Chrome, Safari */
    }
  `;

  function RootLayout() {
    const location = useLocation();
    const isProductDetailPage = location.pathname.startsWith("/product/");
    const isLoginPage = location.pathname === "/login";
    const isMyPage = location.pathname === "/my";
    const isBaroFittingPage = location.pathname === "/baro-fitting";
    const isCartPage = location.pathname === "/cart";

    const getFilterComponent = () => {
      if (isProductDetailPage || isLoginPage || isMyPage || isBaroFittingPage || isCartPage) return null;

      // 홈페이지와 스왑페이지에서 필터 표시
      if (location.pathname === "/") {
        return <HomeFilter />;
      }
      
      if (location.pathname === "/swap") {
        return <SwapFilter />;
      }
      
      return null;
    };

    const filterComponent = getFilterComponent();

    return (
      <div
        style={{
          width: "100vw",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "450px",
            height: "100vh",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Header
            showFilter={location.pathname === "/" || location.pathname === "/swap"}
            filterComponent={filterComponent}
          />
          <ScrollArea>
            <Outlet />
          </ScrollArea>
          {!isProductDetailPage && <GNB />}
        </div>
      </div>
    );
  }

  export default RootLayout;
