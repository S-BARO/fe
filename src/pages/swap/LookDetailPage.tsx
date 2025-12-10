import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { getLookDetail, addCartItem } from "../../libs/api";
import type { LookDetailResponse } from "../../libs/api";

const IMAGE_FADE_MS = 150;
const ROW_IMAGE_FADE_MS = 150;
const SKELETON_BG = "#eceff3";
const ROW_SKELETON_BG = "#eef2f7";

function LookDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [lookDetail, setLookDetail] = useState<LookDetailResponse | null>(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  useEffect(() => {
    if (!id) return;

    let cancelled = false;
    const loadDetail = async () => {
      setIsDetailLoading(true);
      setIsImageLoaded(false);
      try {
        const detail = await getLookDetail(Number(id));
        if (cancelled) return;
        setLookDetail(detail);
      } catch (e) {
        if (!cancelled) console.error(e);
      } finally {
        if (!cancelled) setIsDetailLoading(false);
      }
    };
    void loadDetail();

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (isDetailLoading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "60vh",
          color: "#6b7280",
        }}
      >
        불러오는 중...
      </div>
    );
  }

  if (!lookDetail) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "60vh",
          color: "#6b7280",
        }}
      >
        룩을 찾을 수 없습니다
      </div>
    );
  }

  return (
    <>
      {/* 룩 이미지 */}
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: 500,
          margin: "0 auto",
          aspectRatio: "9/16",
          borderRadius: 20,
          overflow: "hidden",
          backgroundColor: "#fcfcfc",
        }}
      >
        {/* 스켈레톤 */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: SKELETON_BG,
            borderRadius: 20,
            opacity: isImageLoaded ? 0 : 1,
            transition: `opacity ${IMAGE_FADE_MS}ms ease-in-out`,
          }}
        />

        {/* 썸네일 이미지 */}
        <img
          src={lookDetail.thumbnailUrl}
          alt={lookDetail.title}
          onLoad={() => setIsImageLoaded(true)}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = "/shirt.png";
            setIsImageLoaded(true);
          }}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            borderRadius: 20,
            opacity: isImageLoaded ? 1 : 0,
            transition: `opacity ${IMAGE_FADE_MS}ms ease-in-out`,
          }}
        />
      </div>

      {/* 구성 상품 리스트 */}
      <div style={{ padding: "12px 16px", marginTop: 12 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 8,
          }}
        >
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>
            구성 상품
          </h3>
          {lookDetail.products && lookDetail.products.length > 0 && (
            <BatchAddButton products={lookDetail.products} />
          )}
        </div>
        {lookDetail.products && lookDetail.products.length > 0 ? (
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: 0,
              display: "grid",
              gap: 12,
            }}
          >
            {lookDetail.products
              ?.slice()
              ?.sort((a, b) => a.displayOrder - b.displayOrder)
              ?.map((p) => (
                <ProductRow key={p.productId} product={p} />
              ))}
          </ul>
        ) : (
          <div style={{ color: "#6b7280", fontSize: 13 }}>
            구성 상품이 없습니다
          </div>
        )}
      </div>
    </>
  );
}

function BatchAddButton({
  products,
}: {
  products: {
    productId: number;
    productName: string;
    price: number;
    thumbnailUrl: string;
    storeName?: string;
  }[];
}) {
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const handleBatchAddToCart = async () => {
    if (isAddingToCart) return;

    try {
      setIsAddingToCart(true);

      if (!products || products.length === 0) {
        alert("담을 상품이 없습니다.");
        return;
      }

      const addPromises = products.map((product) =>
        addCartItem({ productId: String(product.productId), quantity: 1 })
      );

      await Promise.all(addPromises);
      alert(`${products.length}개 상품을 장바구니에 담았어요.`);
    } catch (err) {
      const anyErr = err as { status?: number; message?: string };
      if (anyErr?.status === 401 || anyErr?.status === 403) {
        alert("로그인이 필요합니다.");
        return;
      }
      alert(anyErr?.message ?? "일괄 담기에 실패했어요.");
    } finally {
      setIsAddingToCart(false);
    }
  };

  return (
    <button
      onClick={handleBatchAddToCart}
      disabled={isAddingToCart}
      style={{
        background: isAddingToCart ? "#e5e7eb" : "#10b981",
        color: "#fff",
        border: "none",
        borderRadius: 6,
        padding: "6px 12px",
        fontSize: 12,
        fontWeight: 500,
        cursor: isAddingToCart ? "not-allowed" : "pointer",
        opacity: isAddingToCart ? 0.6 : 1,
        transition: "all 0.2s ease",
      }}
    >
      {isAddingToCart ? "담는 중..." : "일괄 담기"}
    </button>
  );
}

function ProductRow({
  product,
}: {
  product: {
    productId: number;
    productName: string;
    price: number;
    thumbnailUrl: string;
    storeName?: string;
  };
}) {
  const [loaded, setLoaded] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const navigate = useNavigate();
  const displayName = product.productName || "";

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (isAddingToCart) return;

    try {
      setIsAddingToCart(true);
      await addCartItem({ productId: String(product.productId), quantity: 1 });
      alert("장바구니에 담았어요.");
    } catch (err) {
      const anyErr = err as { status?: number; message?: string };
      if (anyErr?.status === 401 || anyErr?.status === 403) {
        alert("로그인이 필요합니다.");
        return;
      }
      alert(anyErr?.message ?? "장바구니 담기에 실패했어요.");
    } finally {
      setIsAddingToCart(false);
    }
  };

  return (
    <li
      onClick={() => navigate(`/product/${product.productId}`)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        cursor: "pointer",
      }}
      role="button"
      aria-label={`${displayName} 상세로 이동`}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          navigate(`/product/${product.productId}`);
        }
      }}
    >
      <div style={{ position: "relative", width: 60, height: 60 }}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: ROW_SKELETON_BG,
            borderRadius: 10,
            opacity: loaded ? 0 : 1,
            transition: `opacity ${ROW_IMAGE_FADE_MS}ms ease-in-out`,
          }}
        />
        <img
          src={product.thumbnailUrl}
          alt={displayName}
          onLoad={() => setLoaded(true)}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = "/shirt.png";
            setLoaded(true);
          }}
          style={{
            width: 60,
            height: 60,
            borderRadius: 10,
            objectFit: "cover",
            opacity: loaded ? 1 : 0,
            transition: `opacity ${ROW_IMAGE_FADE_MS}ms ease-in-out`,
          }}
        />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
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
          {displayName}
        </div>
        <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 2 }}>
          {product.storeName || "브랜드명"}
        </div>
        <div style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>
          {product.price.toLocaleString()}원
        </div>
      </div>
      <button
        onClick={handleAddToCart}
        style={{
          background: "#0b57d0",
          color: "#fff",
          border: "none",
          borderRadius: 6,
          padding: "6px 12px",
          fontSize: 12,
          fontWeight: 500,
          cursor: "pointer",
        }}
      >
        담기
      </button>
    </li>
  );
}

export default LookDetailPage;
