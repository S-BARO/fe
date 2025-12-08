import styled from "@emotion/styled";
import { useMemo, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { createOrder, getUserProfile, type OrderCreateRequest, type OrderDetailResponse } from "../../libs/api";

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
    if (!itemsStr) return [] as { productId: number; quantity: number; productName: string }[];
    try {
      const parsed = JSON.parse(decodeURIComponent(itemsStr));
      if (Array.isArray(parsed)) return parsed as { productId: number; quantity: number; productName: string }[];
      return [];
    } catch {
      return [];
    }
  }, [loc.search]);
}

export default function OrderConfirmPage() {
  const navigate = useNavigate();
  const items = useOrderItemsFromQuery();
  const [shippingAddress, setShippingAddress] = useState<string>("");
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  const totalQty = items.reduce((sum, it) => sum + it.quantity, 0);

  // userProfile에서 배송지 가져오기
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const profile = await getUserProfile();
        setShippingAddress(profile.address);
      } catch (err) {
        console.error("프로필 조회 실패:", err);
        setShippingAddress("");
      } finally {
        setIsLoadingProfile(false);
      }
    };
    void loadProfile();
  }, []);

  const handleEditAddress = () => {
    const newAddress = prompt("배송지를 입력하세요", shippingAddress);
    if (newAddress !== null && newAddress.trim() !== "") {
      setShippingAddress(newAddress.trim());
    }
  };

  const handleCreate = async () => {
    if (items.length === 0) {
      alert("주문할 상품이 없습니다.");
      navigate("/cart", { replace: true });
      return;
    }
    if (!shippingAddress || shippingAddress.trim() === "") {
      alert("배송지를 입력해주세요.");
      return;
    }
    const body: OrderCreateRequest = {
      shippingAddress: shippingAddress,
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
        {isLoadingProfile ? (
          <div style={{ color: "#6b7280", fontSize: 14 }}>배송지 정보를 불러오는 중...</div>
        ) : (
          <div
            onClick={handleEditAddress}
            style={{
              color: "#374151",
              cursor: "pointer",
              padding: "8px 0",
              borderRadius: "4px",
              transition: "background-color 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#f3f4f6";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            {shippingAddress || "배송지를 입력하려면 클릭하세요"}
          </div>
        )}
      </Section>

      <Section>
        <div style={{ fontWeight: 600, marginBottom: 6 }}>주문 상품</div>
        {items.length === 0 ? (
          <div style={{ color: "#6b7280", fontSize: 14 }}>선택된 상품이 없습니다.</div>
        ) : (
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 8 }}>
            {items.map((it) => (
              <li key={`${it.productId}`} style={{ fontSize: 14, color: "#374151" }}>
                <span>{it.productName}</span>
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

