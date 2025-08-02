import { css } from "@emotion/react";
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

/**
 * 상품 아이템 컴포넌트의 props 타입입니다.
 */
interface ProductItemProps {
  id: number;
  brand: string;
  title: string;
  price: number;
  image: string;
}

function ProductItem({ id, brand, title, price, image }: ProductItemProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/product/${id}`);
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
          `}
        >
          <LikeIcon />
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
