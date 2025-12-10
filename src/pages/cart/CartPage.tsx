import styled from "@emotion/styled";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import {
  deleteCartItem,
  updateCartItemQuantity,
  getCart,
  type CartItemDto,
} from "../../libs/api";

const Page = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  color: #111827;
`;

const Section = styled.div`
  background: #fff;
  padding: 12px 16px;
  border-bottom: 1px solid #e5e7eb;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const ItemThumb = styled.img`
  width: 64px;
  height: 64px;
  object-fit: cover;
  border-radius: 8px;
`;

const QtyStepper = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  width: 74px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  padding: 4px 6px;
  margin-top: 4px;
`;

const StepBtn = styled.button`
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: #f3f4f6;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 500;
`;

const DeleteBtn = styled.button`
  margin-left: auto;
  background: transparent;
  border: none;
  color: #9ca3af;
  cursor: pointer;
`;

const Summary = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  row-gap: 10px;
  column-gap: 12px;
  margin-top: 12px;
  color: #374151;
`;

const Footer = styled.div`
  position: sticky;
  bottom: 0;
  background: #fff;
  border-top: 1px solid #e5e7eb;
  padding: 12px 16px 20px;
`;

const BuyButton = styled.button`
  width: 100%;
  background: #0b57d0;
  color: #fff;
  border: none;
  border-radius: 10px;
  padding: 14px 16px;
  font-weight: 700;
  font-size: 16px;
  cursor: pointer;
  opacity: ${(props: { disabled?: boolean }) => (props.disabled ? 0.6 : 1)};
`;

const SelectAll = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
`;

function CartPage() {
  const [items, setItems] = useState<CartItemDto[]>([]);
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const navigate = useNavigate();

  useEffect(() => {
    const run = async () => {
      try {
        const res = await getCart();
        setItems(res.items);
        // 기본은 모두 선택
        const nextSel: Record<string, boolean> = {};
        for (const it of res.items) nextSel[String(it.itemId)] = true;
        setSelected(nextSel);
      } catch (err) {
        const anyErr = err as { status?: number; message?: string };
        console.error("장바구니 조회 실패:", anyErr);
        // 인증 오류인 경우 이미 AuthGuard에서 처리되므로 여기서는 로깅만
        if (anyErr?.status !== 401 && anyErr?.status !== 403) {
          alert(anyErr?.message ?? "장바구니를 불러오는데 실패했어요.");
        }
      }
    };
    void run();
  }, []);

  const toggleSelect = (itemId: string) =>
    setSelected((prev) => ({
      ...prev,
      [String(itemId)]: !prev[String(itemId)],
    }));

  const setAll = (checked: boolean) => {
    const next: Record<string, boolean> = {};
    for (const it of items) next[String(it.itemId)] = checked;
    setSelected(next);
  };

  const handleQtyChangeByProduct = async (
    productId: string,
    nextQty: number
  ) => {
    if (nextQty < 1) return;
    const target = items.find((it) => it.productId === productId);
    if (!target) return;
    try {
      await updateCartItemQuantity(String(target.itemId), nextQty);
      setItems((prev) =>
        prev.map((it) =>
          it.productId === productId
            ? { ...it, quantity: nextQty, subtotal: it.price * nextQty }
            : it
        )
      );
    } catch (err) {
      const anyErr = err as { message?: string };
      alert(anyErr?.message ?? "수정에 실패했어요.");
    }
  };

  const handleRemove = async (itemId: string) => {
    try {
      await deleteCartItem(String(itemId));
      setItems((prev) =>
        prev.filter((it) => String(it.itemId) !== String(itemId))
      );
      setSelected((prev) => {
        const n = { ...prev };
        delete n[String(itemId)];
        return n;
      });
    } catch (err) {
      const anyErr = err as { message?: string };
      alert(anyErr?.message ?? "삭제에 실패했어요.");
    }
  };

  const selectedItems = useMemo(
    () => items.filter((it) => selected[String(it.itemId)]),
    [items, selected]
  );
  const itemsAmount = useMemo(
    () => selectedItems.reduce((sum, it) => sum + it.price * it.quantity, 0),
    [selectedItems]
  );

  const shippingFee = 0;
  const totalAmount = Math.max(0, itemsAmount + shippingFee);

  const handleProceedToOrder = () => {
    const payload = selectedItems.map((it) => ({
      productId: Number(it.productId),
      quantity: it.quantity,
<<<<<<< HEAD
=======
      productName: it.productName
>>>>>>> e63269000f7fe938d7252fc863eb5eef3a1b6f7e
    }));
    const encoded = encodeURIComponent(JSON.stringify(payload));
    navigate(`/order/confirm?items=${encoded}`);
  };

  return (
    <Page>
      <Section>
        <SelectAll>
          <input
            type="checkbox"
            checked={items.length > 0 && selectedItems.length === items.length}
            onChange={(e) => setAll(e.target.checked)}
          />
          전체 선택
        </SelectAll>
      </Section>

      {items.length === 0 ? (
        <Section>장바구니가 비어있어요.</Section>
      ) : (
        items.map((it) => (
          <Section key={it.itemId}>
            <Row>
              <input
                type="checkbox"
                checked={!!selected[String(it.itemId)]}
                onChange={() => toggleSelect(String(it.itemId))}
              />
              <ItemThumb src={it.productThumbnailUrl} alt={it.productName} />
              <div style={{ flex: 1 }}>
                <div
                  style={{ fontSize: 12, color: "#6b7280", marginBottom: 2 }}
                >
                  {it.storeName || "브랜드명"}
                </div>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 500,
                    marginBottom: 2,
                    lineHeight: 1.3,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                  }}
                >
                  {it.productName}
                </div>
                <div
                  style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}
                >
                  {it.price.toLocaleString()}원
                </div>
                <QtyStepper>
                  <StepBtn
                    onClick={() =>
                      handleQtyChangeByProduct(it.productId, it.quantity - 1)
                    }
                  >
                    -
                  </StepBtn>
                  <span
                    style={{
                      minWidth: 20,
                      textAlign: "center",
                      fontSize: 12,
                      fontWeight: 500,
                    }}
                  >
                    {it.quantity}
                  </span>
                  <StepBtn
                    onClick={() =>
                      handleQtyChangeByProduct(it.productId, it.quantity + 1)
                    }
                  >
                    +
                  </StepBtn>
                </QtyStepper>
              </div>
              <DeleteBtn onClick={() => handleRemove(String(it.itemId))}>
                ×
              </DeleteBtn>
            </Row>
          </Section>
        ))
      )}

      <Section>
        <Summary>
          <div>상품 금액</div>
          <div>{itemsAmount.toLocaleString()}원</div>
          <div>배송비</div>
          <div>무료</div>
          <div style={{ fontWeight: 800 }}>총 결제 금액</div>
          <div style={{ color: "#0b57d0", fontWeight: 800 }}>
            {totalAmount.toLocaleString()}원
          </div>
        </Summary>
      </Section>

      <Footer>
        <BuyButton
          disabled={selectedItems.length === 0}
          onClick={handleProceedToOrder}
        >
          구매하기
        </BuyButton>
      </Footer>
    </Page>
  );
}

export default CartPage;
