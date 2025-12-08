import styled from "@emotion/styled";
import { useMemo } from "react";
import { useLocation, useNavigate } from "react-router";
import { createOrder, type OrderCreateRequest, type OrderDetailResponse } from "../../libs/api";

const Page = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 390px;
  margin: 0 auto;
  color: #111827;
`;

const Section = styled.div`
  background: #fff;
  padding: 12px 16px;
  border-bottom: 1px solid #e5e7eb;
`;

const Footer = styled.div`
  position: sticky;
  bottom: 0;
  background: #fff;
  border-top: 1px solid #e5e7eb;
  padding: 12px 16px 20px;
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
`;

function useOrderItemsFromQuery() {
  const loc = useLocation();
  return useMemo(() => {
    const params = new URLSearchParams(loc.search);
    const itemsStr = params.get("items");
    if (!itemsStr) return [] as { productId: number; quantity: number }[];
    try {
      const parsed = JSON.parse(decodeURIComponent(itemsStr));
      if (Array.isArray(parsed)) return parsed as { productId: number; quantity: number }[];
      return [];
    } catch {
      return [];
    }
  }, [loc.search]);
}

export default function OrderConfirmPage() {
  const navigate = useNavigate();
  const items = useOrderItemsFromQuery();

  const totalQty = items.reduce((sum, it) => sum + it.quantity, 0);

  const handleCreate = async () => {
    if (items.length === 0) {
      alert("주문할 상품이 없습니다.");
      navigate("/cart", { replace: true });
      return;
    }
    const body: OrderCreateRequest = {
      shippingAddress: "서울특별시 강남구 테헤란로 123",
      orderItems: items,
    };
    try {
      const res: OrderDetailResponse = await createOrder(body);
      navigate(`/order/success?orderId=${encodeURIComponent(String(res.orderId))}`);
    } catch (err) {
      const anyErr = err as { message?: string };
      alert(anyErr?.message ?? "주문에 실패했어요.");
    }
  };

  return (
    <Page>
      <Section>
        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>주문 확인</h3>
        <div style={{ marginTop: 8, color: "#6b7280", fontSize: 14 }}>총 {totalQty}개 상품</div>
      </Section>

      <Section>
        <div style={{ fontWeight: 600, marginBottom: 6 }}>배송지</div>
        <div style={{ color: "#374151" }}>서울특별시 강남구 테헤란로 123</div>
      </Section>

      <Section>
        <div style={{ fontWeight: 600, marginBottom: 6 }}>주문 상품</div>
        {items.length === 0 ? (
          <div style={{ color: "#6b7280", fontSize: 14 }}>선택된 상품이 없습니다.</div>
        ) : (
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 8 }}>
            {items.map((it) => (
              <li key={`${it.productId}`} style={{ display: "flex", justifyContent: "space-between", fontSize: 14 }}>
                <span>상품 {it.productId}</span>
                <span>x {it.quantity}</span>
              </li>
            ))}
          </ul>
        )}
      </Section>

      <Footer>
        <PrimaryBtn onClick={handleCreate}>주문하기</PrimaryBtn>
      </Footer>
    </Page>
  );
}

