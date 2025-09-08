import styled from "@emotion/styled";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { getOrderDetail, type OrderDetailResponse } from "../../libs/api";

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

const ItemRow = styled.div`
  display: grid;
  grid-template-columns: 60px 1fr auto;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid #f3f4f6;
`;

const Thumb = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 8px;
  object-fit: cover;
  background: #f3f4f6;
`;

export default function OrderDetailPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const [data, setData] = useState<OrderDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getOrderDetail(orderId ?? "");
        setData(res);
      } catch (e) {
        setError("주문 정보를 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };
    if (orderId) void run();
  }, [orderId]);

  return (
    <Page>
      <Title>주문 상세</Title>
      {loading ? (
        <div style={{ color: "#6b7280" }}>불러오는 중...</div>
      ) : error ? (
        <div style={{ color: "#ef4444" }}>{error}</div>
      ) : data ? (
        <>
          <div style={{ marginBottom: 12 }}>
            <div>주문번호: <strong>{data.orderId}</strong></div>
            <div style={{ color: "#6b7280", fontSize: 12 }}>{new Date(data.orderedAt).toLocaleString()}</div>
            <div style={{ marginTop: 6 }}>상태: {data.orderStatus}</div>
            <div style={{ marginTop: 6 }}>배송지: {data.shippingAddress}</div>
            <div style={{ marginTop: 6, fontWeight: 800 }}>총액: {data.totalPrice.toLocaleString()}원</div>
          </div>
          <div>
            {data.items.map((it) => (
              <ItemRow key={`${it.productId}`}>
                <Thumb src={it.thumbnailUrl} alt={it.productName} onError={(e) => { e.currentTarget.src = "/shirt.png"; }} />
                <div>
                  <div style={{ fontWeight: 600 }}>{it.productName}</div>
                  <div style={{ color: "#6b7280", fontSize: 12 }}>상품 ID: {it.productId}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div>x {it.quantity}</div>
                  <div style={{ fontWeight: 700 }}>{it.priceAtPurchase.toLocaleString()}원</div>
                </div>
              </ItemRow>
            ))}
          </div>
        </>
      ) : (
        <div>주문 정보를 찾을 수 없습니다.</div>
      )}
    </Page>
  );
}


