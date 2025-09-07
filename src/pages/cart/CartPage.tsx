import styled from "@emotion/styled";
import { useEffect, useMemo, useState } from "react";
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
  max-width: 390px;
  margin: 0 auto;
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
  gap: 8px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 6px 8px;
`;

const StepBtn = styled.button`
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: #f3f4f6;
  border-radius: 6px;
  cursor: pointer;
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
  const [selected, setSelected] = useState<Record<number, boolean>>({});

  useEffect(() => {
    const run = async () => {
      try {
        const res = await getCart();
        setItems(res.items);
        // 기본은 모두 선택
        const nextSel: Record<number, boolean> = {};
        for (const it of res.items) nextSel[it.itemId] = true;
        setSelected(nextSel);
      } catch {
        // noop
      }
    };
    void run();
  }, []);

  const toggleSelect = (itemId: number) =>
    setSelected((prev) => ({ ...prev, [itemId]: !prev[itemId] }));

  const setAll = (checked: boolean) => {
    const next: Record<number, boolean> = {};
    for (const it of items) next[it.itemId] = checked;
    setSelected(next);
  };

  const handleQtyChange = async (itemId: number, nextQty: number) => {
    if (nextQty < 1) return;
    try {
      await updateCartItemQuantity(itemId, nextQty);
      setItems((prev) =>
        prev.map((it) =>
          it.itemId === itemId
            ? { ...it, quantity: nextQty, subtotal: it.price * nextQty }
            : it
        )
      );
    } catch (err) {
      const anyErr = err as { message?: string };
      alert(anyErr?.message ?? "수정에 실패했어요.");
    }
  };

  const handleRemove = async (itemId: number) => {
    try {
      await deleteCartItem(itemId);
      setItems((prev) => prev.filter((it) => it.itemId !== itemId));
      setSelected((prev) => {
        const n = { ...prev };
        delete n[itemId];
        return n;
      });
    } catch (err) {
      const anyErr = err as { message?: string };
      alert(anyErr?.message ?? "삭제에 실패했어요.");
    }
  };

  const selectedItems = useMemo(
    () => items.filter((it) => selected[it.itemId]),
    [items, selected]
  );
  const itemsAmount = useMemo(
    () => selectedItems.reduce((sum, it) => sum + it.price * it.quantity, 0),
    [selectedItems]
  );

  const shippingFee = 0;
  const totalAmount = Math.max(0, itemsAmount + shippingFee);

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
                checked={!!selected[it.itemId]}
                onChange={() => toggleSelect(it.itemId)}
              />
              <ItemThumb src={it.productThumbnailUrl} alt={it.productName} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14 }}>{it.productName}</div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>
                  {it.price.toLocaleString()}원
                </div>
                <QtyStepper>
                  <StepBtn
                    onClick={() => handleQtyChange(it.itemId, it.quantity - 1)}
                  >
                    -
                  </StepBtn>
                  <span style={{ minWidth: 16, textAlign: "center" }}>
                    {it.quantity}
                  </span>
                  <StepBtn
                    onClick={() => handleQtyChange(it.itemId, it.quantity + 1)}
                  >
                    +
                  </StepBtn>
                </QtyStepper>
              </div>
              <DeleteBtn onClick={() => handleRemove(it.itemId)}>×</DeleteBtn>
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
          onClick={() => alert("구매하기 진행")}
        >
          구매하기
        </BuyButton>
      </Footer>
    </Page>
  );
}

export default CartPage;
