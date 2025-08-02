import React, { useState } from "react";
import styled from "@emotion/styled";

const ProductDetailContainer = styled.div`
  width: 100%;
  background: #fff;
`;

const ProductImageSection = styled.div`
  position: relative;
  background: #fff;
`;

const ProductImage = styled.img`
  width: 100%;
  height: 400px;
  object-fit: cover;
`;

const PaginationDots = styled.div`
  display: flex;
  justify-content: center;
  gap: 8px;
  padding: 16px;
`;

const Dot = styled.div<{ active?: boolean }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${(props) => (props.active ? "#111" : "#e5e7eb")};
`;

const ProductInfo = styled.div`
  padding: 20px 16px;
  border-bottom: 1px solid #f3f4f6;
`;

const ProductName = styled.h2`
  font-size: 16px;
  font-weight: 500;
  margin: 0 0 12px 0;
  line-height: 1.4;
`;

const ProductPrice = styled.div`
  font-size: 20px;
  font-weight: 700;
  color: #111;
`;

const CollapsibleSection = styled.div`
  border-bottom: 1px solid #f3f4f6;
`;

const SectionHeader = styled.button`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 14px;
  text-align: left;
`;

const SectionTitle = styled.span`
  font-weight: 500;
`;

const ChevronIcon = styled.span<{ isOpen?: boolean }>`
  transform: ${(props) => (props.isOpen ? "rotate(90deg)" : "rotate(0deg)")};
  transition: transform 0.2s ease;
`;

const SectionContent = styled.div<{ isOpen?: boolean }>`
  max-height: ${(props) => (props.isOpen ? "200px" : "0")};
  overflow: hidden;
  transition: max-height 0.3s ease;
  padding: ${(props) => (props.isOpen ? "0 16px 16px 16px" : "0 16px")};
  color: #6b7280;
  font-size: 14px;
  line-height: 1.5;
`;

const ActionBar = styled.div`
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
  border-top: 1px solid #f3f4f6;
  gap: 12px;
`;

const LikeButton = styled.button`
  background: none;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 12px;
  cursor: pointer;
  font-size: 20px;
`;

const BuyButton = styled.button`
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

const BottomSpacer = styled.div`
  height: 80px;
`;

function ProductDetailPage() {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  const toggleSection = (sectionName: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [sectionName]: !prev[sectionName],
    }));
  };

  const sections = [
    {
      id: "product",
      title: "상품 정보",
      content: "무신사 스탠다드 오버핏 후드 집업의 상세한 상품 정보입니다.",
    },
    {
      id: "material",
      title: "소재 정보",
      content: "면 100% 소재로 제작되어 편안한 착용감을 제공합니다.",
    },
    {
      id: "washing",
      title: "세탁 방법",
      content: "30도 이하에서 중성세제로 세탁하시기 바랍니다.",
    },
    {
      id: "model",
      title: "모델 착용 정보",
      content: "모델 키 180cm, 착용 사이즈 M입니다.",
    },
  ];

  return (
    <ProductDetailContainer>
      <ProductImageSection>
        <ProductImage src="/shirt.png" alt="무신사 스탠다드 오버핏 후드 집업" />
        <PaginationDots>
          <Dot active />
          <Dot />
          <Dot />
          <Dot />
        </PaginationDots>
      </ProductImageSection>

      <ProductInfo>
        <ProductName>무신사 스탠다드 오버핏 후드 집업 [화이트]</ProductName>
        <ProductPrice>89,000원</ProductPrice>
      </ProductInfo>

      {sections.map((section) => (
        <CollapsibleSection key={section.id}>
          <SectionHeader onClick={() => toggleSection(section.id)}>
            <SectionTitle>{section.title}</SectionTitle>
            <ChevronIcon isOpen={openSections[section.id]}>▶</ChevronIcon>
          </SectionHeader>
          <SectionContent isOpen={openSections[section.id]}>
            {section.content}
          </SectionContent>
        </CollapsibleSection>
      ))}

      <BottomSpacer />

      <ActionBar>
        <LikeButton>♡</LikeButton>
        <BuyButton>구매하기</BuyButton>
      </ActionBar>
    </ProductDetailContainer>
  );
}

export default ProductDetailPage;
