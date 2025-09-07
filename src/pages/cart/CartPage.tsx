import styled from "@emotion/styled";
import { useEffect, useState } from "react";
import { deleteCartItem, updateCartItemQuantity, getCart, type CartItemDto } from "../../libs/api";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #333;
`;

const Controls = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 16px;
`;

function CartPage() {
  const [itemId, setItemId] = useState<string>("");
  const [items, setItems] = useState<CartItemDto[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);

  useEffect(() => {
    const run = async () => {
      try {
        const res = await getCart();
        setItems(res.items);
        setTotalPrice(res.totalPrice);
      } catch (err) {
        // noop: 간단 표시
      }
    };
    void run();
  }, []);

  const handleDelete = async () => {
    const id = Number(itemId);
    if (!Number.isInteger(id) || id <= 0) {
      alert("올바른 itemId를 입력해 주세요.");
      return;
    }
    try {
      await deleteCartItem(id);
      alert("삭제했어요.");
    } catch (err) {
      const anyErr = err as { status?: number; message?: string };
      alert(anyErr?.message ?? "삭제에 실패했어요.");
    }
  };

  const handleUpdate = async () => {
    const id = Number(itemId);
    const qty = Number(prompt("변경할 수량을 입력하세요", "1") ?? "");
    if (!Number.isInteger(id) || id <= 0 || !Number.isInteger(qty) || qty <= 0) {
      alert("올바른 값(itemId, quantity)을 입력해 주세요.");
      return;
    }
    try {
      await updateCartItemQuantity(id, qty);
      alert("수정했어요.");
    } catch (err) {
      const anyErr = err as { status?: number; message?: string };
      alert(anyErr?.message ?? "수정에 실패했어요.");
    }
  };

  return (
    <Wrapper>
      {items.length === 0 ? (
        <>장바구니가 비어있어요.</>
      ) : (
        <div style={{ width: "100%", maxWidth: 390, padding: 16 }}>
          {items.map((it) => (
            <div key={it.itemId} style={{ display: "flex", gap: 12, marginBottom: 12, alignItems: "center" }}>
              <img src={it.productThumbnailUrl} alt={it.productName} width={56} height={56} style={{ borderRadius: 8, objectFit: "cover" }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14 }}>{it.productName}</div>
                <div style={{ fontSize: 12, color: "#666" }}>
                  {it.price.toLocaleString()}원 × {it.quantity} = {it.subtotal.toLocaleString()}원
                </div>
              </div>
            </div>
          ))}
          <div style={{ textAlign: "right", fontWeight: 600 }}>
            합계 {totalPrice.toLocaleString()}원
          </div>
        </div>
      )}
      <Controls>
        <input
          value={itemId}
          onChange={(e) => setItemId(e.target.value)}
          placeholder="itemId"
          style={{ padding: 8, border: "1px solid #ddd", borderRadius: 8 }}
        />
        <button onClick={handleDelete} style={{ padding: 8, borderRadius: 8 }}>
          아이템 삭제
        </button>
        <button onClick={handleUpdate} style={{ padding: 8, borderRadius: 8 }}>
          수량 수정
        </button>
      </Controls>
    </Wrapper>
  );
}

export default CartPage;


