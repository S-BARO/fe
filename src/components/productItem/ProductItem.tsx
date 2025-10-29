import { css } from "@emotion/react";
import { useState } from "react";
import { useNavigate } from "react-router";
import {
  ProductBrand,
  ProductImage,
  ProductInfoWrapper,
  ProductItemWrapper,
  ProductPrice,
  ProductTitle,
} from "./styles";
import LikeIcon from "../icons/Like";
import { likeProduct, unlikeProduct } from "../../libs/api";
import { useAuth } from "../../contexts/auth";

/**
 * 상품 아이템 컴포넌트의 props 타입입니다.
 */
interface ProductItemProps {
  id: number;
  brand: string;
  title: string;
  price: number;
  image: string;
  isLiked?: boolean; // 좋아요 상태 (선택적)
}

function ProductItem({
  id,
  brand,
  title,
  price,
  image,
  isLiked: initialLiked = false,
}: ProductItemProps) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [isLiked, setIsLiked] = useState(initialLiked);
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = () => {
    navigate(`/product/${id}`);
  };

  const handleLikeClick = async (e: React.MouseEvent) => {
    e.stopPropagation(); // 상품 상세 페이지로 이동하는 것을 방지

    if (isLoading) return;

    // 로그인 체크
    if (!isAuthenticated) {
      alert("로그인이 필요합니다.");
      navigate("/login");
      return;
    }

    try {
      setIsLoading(true);

      if (isLiked) {
        await unlikeProduct(id);
        setIsLiked(false);
      } else {
        await likeProduct(id);
        setIsLiked(true);
      }
    } catch (err) {
      const anyErr = err as { status?: number; message?: string };
      if (anyErr?.status === 401) {
        alert("로그인이 필요합니다.");
        navigate("/login");
        return;
      }
      alert(anyErr?.message ?? "좋아요 처리에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ProductItemWrapper onClick={handleClick}>
      <div
        css={css`
          position: relative;
          width: 111px;
          height: 139px;
        `}
      >
        <ProductImage src={image} alt={title} />
        <div
          css={css`
            position: absolute;
            bottom: 8px;
            right: 8px;
            cursor: pointer;
            opacity: ${isLoading ? 0.6 : 1};
            transition: opacity 0.2s ease;
          `}
          onClick={handleLikeClick}
        >
          <LikeIcon filled={isLiked} />
        </div>
      </div>
      <ProductInfoWrapper>
        <ProductBrand>{brand}</ProductBrand>
        <ProductTitle>{title}</ProductTitle>
        <ProductPrice>{price.toLocaleString()}원</ProductPrice>
      </ProductInfoWrapper>
    </ProductItemWrapper>
  );
}

export default ProductItem;
