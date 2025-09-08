import styled from "@emotion/styled";
import SwipeCards from "./SwipeCards";

const SwapContainer = styled.div`
  padding: 20px 16px;
`;

const SwapTitle = styled.h1`
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 16px;
`;

function SwapPage() {
  return (
    <SwapContainer>
      <SwapTitle>스왑</SwapTitle>
      <SwipeCards />
    </SwapContainer>
  );
}

export default SwapPage;
