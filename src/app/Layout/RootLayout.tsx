import { Outlet, useLocation } from "react-router";
import Header from "../../components/Header/Header";
import GNB from "../../components/GNB/GNB";
import styled from "@emotion/styled";
import HomeFilter from "../../components/Filter/HomeFilter";
import SwapFilter from "../../components/Filter/SwapFilter";

// 라벨: RootLayout-ScrollArea (css-19qyp3z로 생성되는 외부 컨테이너)
const ScrollArea = styled.div`
  max-width: 390px;
  width: 100%;
  margin: 0 auto;
  flex: 1;
  min-height: 0; /* flex 축소 문제 해결 */
  overflow-y: auto;
  padding-bottom: ${(props: { hasGNB: boolean }) =>
    props.hasGNB
      ? "calc(81px + env(safe-area-inset-bottom, 0px))"
      : "0"}; /* GNB 높이 + safe area */
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
    if (
      isProductDetailPage ||
      isLoginPage ||
      isMyPage ||
      isBaroFittingPage ||
      isCartPage
    )
      return null;

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
        height: "100dvh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "450px",
          height: "100dvh",
          minHeight: "100dvh",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden" /* 전체 컨테이너 스크롤 방지 */,
          position: "relative",
        }}
      >
        <Header
          showFilter={
            location.pathname === "/" || location.pathname === "/swap"
          }
          filterComponent={filterComponent}
        />
        <ScrollArea
          hasGNB={!isProductDetailPage}
          data-label="RootLayout-ScrollArea"
        >
          <Outlet />
        </ScrollArea>
        {!isProductDetailPage && <GNB />}
      </div>
    </div>
  );
}

export default RootLayout;
