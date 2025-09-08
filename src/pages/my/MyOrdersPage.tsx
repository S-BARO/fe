import styled from "@emotion/styled";
import { useEffect, useMemo, useState } from "react";
import { getOrders, type OrdersSliceItem } from "../../libs/api";
import { useNavigate } from "react-router";

const Page = styled.div`
  padding: 20px 16px;
  background: #fff;
  min-height: 100vh;
`;

const Title = styled.h1`
  font-size: 20px;
  font-weight: 800;
  margin: 0 0 12px;
`;

const OrderCard = styled.div`
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 12px;
  margin-bottom: 12px;
  cursor: pointer;
`;

const LoadMore = styled.button`
  width: 100%;
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid #e5e7eb;
  background: #f9fafb;
  cursor: pointer;
`;

export default function MyOrdersPage() {
  const [items, setItems] = useState<OrdersSliceItem[]>([]);
  const [cursor, setCursor] = useState<number | undefined>(undefined);
  const [hasNext, setHasNext] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchPage = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const res = await getOrders({ cursorId: cursor, size: 10 });
      setItems((prev) => [...prev, ...res.content]);
      setHasNext(res.hasNext);
      setCursor(res.nextCursor?.id);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchPage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Page>
      <Title>주문 내역</Title>
      {items.length === 0 && !loading ? (
        <div style={{ color: "#6b7280" }}>주문 내역이 없습니다.</div>
      ) : (
        items.map((o) => (
          <OrderCard key={o.orderId} onClick={() => navigate(`/my/orders/${o.orderId}`)}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <div style={{ fontWeight: 700 }}>주문번호 {o.orderId}</div>
              <div style={{ color: "#6b7280", fontSize: 12 }}>{new Date(o.orderedAt).toLocaleString()}</div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div style={{ color: "#374151" }}>{o.orderStatus}</div>
              <div style={{ fontWeight: 800 }}>{o.totalPrice.toLocaleString()}원</div>
            </div>
          </OrderCard>
        ))
      )}

      {hasNext && (
        <LoadMore onClick={() => void fetchPage()} disabled={loading}>
          {loading ? "불러오는 중..." : "더 보기"}
        </LoadMore>
      )}
    </Page>
  );
}


