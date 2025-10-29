import styled from "@emotion/styled";
import { useTabFilter } from "../../libs/useTabFilter";
import SwipeCards from "./SwipeCards";
import LikedLooks from "./LikedLooks";

const SwapContainer = styled.div`
  padding: 12px;
`;

const SwapTitle = styled.h1`
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 16px;
`;

function SwapPage() {
  // 상단 글로벌 탭(SwapFilter)과 동기화된 탭 상태를 사용
  const tabs = ["스왑", "나의 룩 보기"] as const;
  const [activeTab] = useTabFilter(tabs as unknown as string[], "tab");

  return (
    <SwapContainer>
      <SwapTitle>스왑</SwapTitle>
      {activeTab === "스왑" ? <SwipeCards /> : <LikedLooks />}
    </SwapContainer>
  );
}

export default SwapPage;
