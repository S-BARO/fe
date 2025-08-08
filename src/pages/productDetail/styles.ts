import styled from "@emotion/styled";

export const ProductDetailContainer = styled.div`
  width: 100%;
  background: #fff;
`;

export const ProductImageSection = styled.div`
  position: relative;
  background: #fff;
`;

export const ProductImage = styled.img`
  width: 100%;
  height: 384px;
  object-fit: contain;
`;

export const PaginationDots = styled.div`
  display: flex;
  justify-content: center;
  gap: 8px;
  padding: 12px;
`;

export const Dot = styled.div<{ active?: boolean }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${(props) => (props.active ? "#111827" : "#D1D5DB")};
`;

export const ProductInfo = styled.div`
  padding: 20px 16px;
  border-bottom: 1px solid #e5e7eb;
`;

export const ProductBrand = styled.div`
  color: #111827;
  font-family: "Noto Sans KR";
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  margin-bottom: 4px;
`;

export const ProductName = styled.h2`
  color: #1f2937;
  font-family: "Noto Sans KR";
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  margin-bottom: 12px;
`;

export const ProductPrice = styled.div`
  color: #111827;
  font-family: "Noto Sans KR";
  font-size: 24px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
`;

export const CollapsibleSection = styled.div`
  border-bottom: 1px solid #e5e7eb;
  padding: 16px 12px 19px 12px;
`;

export const SectionHeader = styled.button`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 14px;
  text-align: left;
`;

export const SectionTitle = styled.span`
  color: #111827;
  font-family: "Noto Sans KR";
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px;
`;

export const ChevronIconWrapper = styled.span<{ isOpen?: boolean }>``;

export const SectionContent = styled.div<{ isOpen?: boolean }>`
  max-height: ${(props) => (props.isOpen ? "200px" : "0")};
  overflow: hidden;
  transition: max-height 0.3s ease;
  padding: ${(props) => (props.isOpen ? "12px 6px 19px 6px" : "0 16px")};
  color: #6b7280;
  font-size: 14px;
  line-height: 1.5;
`;

export const ActionBar = styled.div`
  box-sizing: border-box;
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 390px;
  display: flex;
  align-items: center;
  padding: 16px;
  background: #fff;
  border-top: 1px solid #e5e7eb;
  gap: 12px;
`;

export const LikeButton = styled.button`
  background: none;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 12px;
  cursor: pointer;
  font-size: 20px;
`;

export const BuyButton = styled.button`
  flex: 1;
  background: #111;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 16px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
`;

export const BottomSpacer = styled.div`
  height: 80px;
`;
