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

const SwapDescription = styled.p`
  color: #6b7280;
  line-height: 1.5;
`;

function SwapPage() {
  return (
    <SwapContainer>
      <SwapTitle>스왑</SwapTitle>
      <SwapDescription>
        다른 사용자와 상품을 교환할 수 있는 공간입니다. 원하는 상품을
        찾아보세요!
      </SwapDescription>
      <SwipeCards />
    </SwapContainer>
  );
}

export default SwapPage;
