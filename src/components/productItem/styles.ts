import styled from "@emotion/styled";

export const ProductItemWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  cursor: pointer;
`;

export const ProductImage = styled.img`
  width: 111px;
  height: 139px;
`;

export const ProductInfoWrapper = styled.div`
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

export const ProductBrand = styled.div`
  color: #111827;
  font-size: 12px;
`;

export const ProductTitle = styled.div`
  color: #374151;
  font-size: 12px;
`;

export const ProductPrice = styled.div`
  color: #000000;
  font-size: 14px;
`;
