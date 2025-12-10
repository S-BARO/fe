import styled from "@emotion/styled";
import { useMemo } from "react";
import { useLocation, useNavigate } from "react-router";

// 라벨: OrderSuccessPage-Page (emotion styled 컴포넌트)
const OrderSuccessPageContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
  color: #111827;
  padding: 24px 16px;
`;

const PrimaryBtn = styled.button`
  width: 100%;
  background: #0b57d0;
  color: #fff;
  border: none;
  border-radius: 10px;
  padding: 14px 16px;
  font-weight: 700;
  font-size: 16px;
  cursor: pointer;
  margin-top: 20px;
`;

export default function OrderSuccessPage() {
  const loc = useLocation();
  const navigate = useNavigate();
  const orderId = useMemo(
    () => new URLSearchParams(loc.search).get("orderId"),
    [loc.search]
  );

  return (
    <OrderSuccessPageContainer>
      <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800 }}>주문 완료</h2>
      <p style={{ color: "#6b7280", marginTop: 8, fontSize: 14 }}>
        주문이 정상적으로 접수되었습니다.
      </p>
      <div style={{ marginTop: 12, fontSize: 14 }}>
        주문번호: <strong>{orderId}</strong>
      </div>
      <PrimaryBtn onClick={() => navigate("/")}>홈으로</PrimaryBtn>
    </OrderSuccessPageContainer>
  );
}
