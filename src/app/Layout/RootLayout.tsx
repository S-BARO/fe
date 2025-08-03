import { Outlet, useLocation } from "react-router";
import Header from "../../components/Header/Header";
import GNB from "../../components/GNB/GNB";
import styled from "@emotion/styled";
import HomeFilter from "../../components/Filter/HomeFilter";
import SwapFilter from "../../components/Filter/SwapFilter";
import LikeFilter from "../../components/Filter/LikeFilter";

const ScrollArea = styled.div`
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

  const getFilterComponent = () => {
    if (isProductDetailPage) return null;

    switch (location.pathname) {
      case "/":
        return <HomeFilter />;
      case "/swap":
        return <SwapFilter />;
      case "/categories":
        return <HomeFilter />; // 임시로 HomeFilter 사용
      case "/like":
        return <LikeFilter />; // 임시로 HomeFilter 사용
      case "/my":
        return <HomeFilter />; // 임시로 HomeFilter 사용
      default:
        return <HomeFilter />;
    }
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
          maxWidth: "390px",
          width: "100%",
          height: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Header
          showFilter={!isProductDetailPage}
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
