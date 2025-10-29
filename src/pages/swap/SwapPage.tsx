import styled from "@emotion/styled";
import { useState } from "react";
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

const TabContainer = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
`;

const TabButton = styled.button<{ active: boolean }>`
  padding: 8px 16px;
  border: none;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${(props) => (props.active ? "#0b57d0" : "#f3f4f6")};
  color: ${(props) => (props.active ? "#fff" : "#6b7280")};

  &:hover {
    background: ${(props) => (props.active ? "#0a4bb5" : "#e5e7eb")};
  }
`;

function SwapPage() {
  const [activeTab, setActiveTab] = useState<"swipe" | "liked">("swipe");

  return (
    <SwapContainer>
      <SwapTitle>스왑</SwapTitle>
      <TabContainer>
        <TabButton
          active={activeTab === "swipe"}
          onClick={() => setActiveTab("swipe")}
        >
          스와이프
        </TabButton>
        <TabButton
          active={activeTab === "liked"}
          onClick={() => setActiveTab("liked")}
        >
          나의 룩 보기
        </TabButton>
      </TabContainer>
      {activeTab === "swipe" ? <SwipeCards /> : <LikedLooks />}
    </SwapContainer>
  );
}

export default SwapPage;
