import { useState } from "react";
import ChevronIcon from "../../components/icons/ChevronIcon";
import HeartIcon from "../../components/icons/HeartIcon";
import {
  ProductDetailContainer,
  ProductImageSection,
  ProductImage,
  PaginationDots,
  Dot,
  ProductInfo,
  ProductName,
  ProductPrice,
  ProductBrand,
  CollapsibleSection,
  SectionHeader,
  SectionTitle,
  SectionContent,
  ActionBar,
  LikeButton,
  BuyButton,
  BottomSpacer,
  ChevronIconWrapper,
} from "./styles";

function ProductDetailPage() {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
  const [isLiked, setIsLiked] = useState(false);

  const toggleSection = (sectionName: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [sectionName]: !prev[sectionName],
    }));
  };

  const handleLikeClick = () => {
    setIsLiked(!isLiked);
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
        <ProductBrand>무신사</ProductBrand>
        <ProductName>무신사 스탠다드 오버핏 후드 집업 [화이트]</ProductName>
        <ProductPrice>89,000원</ProductPrice>
      </ProductInfo>

      {sections.map((section) => (
        <CollapsibleSection key={section.id}>
          <SectionHeader onClick={() => toggleSection(section.id)}>
            <SectionTitle>{section.title}</SectionTitle>
            <ChevronIconWrapper isOpen={openSections[section.id]}>
              <ChevronIcon />
            </ChevronIconWrapper>
          </SectionHeader>
          <SectionContent isOpen={openSections[section.id]}>
            {section.content}
          </SectionContent>
        </CollapsibleSection>
      ))}

      <BottomSpacer />

      <ActionBar>
        <LikeButton onClick={handleLikeClick}>
          <HeartIcon active={isLiked} />
        </LikeButton>
        <BuyButton>구매하기</BuyButton>
      </ActionBar>
    </ProductDetailContainer>
  );
}

export default ProductDetailPage;
