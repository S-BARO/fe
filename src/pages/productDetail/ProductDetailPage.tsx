import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getProductDetail } from "../../libs/api";
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
  const { id } = useParams<{ id: string }>();
  const productId = parseInt(id || "0", 10);

  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
  const [isLiked, setIsLiked] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const {
    data: product,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["product", productId],
    queryFn: () => getProductDetail(productId),
    enabled: productId > 0,
  });

  const toggleSection = (sectionName: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [sectionName]: !prev[sectionName],
    }));
  };

  const handleLikeClick = () => {
    setIsLiked(!isLiked);
  };

  const handleImageDotClick = (index: number) => {
    setCurrentImageIndex(index);
  };

  const handleImageClick = () => {
    if (product?.images && product.images.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
    }
  };

  const sections = [
    {
      id: "product",
      title: "상품 정보",
      content: product?.description || "상품 정보를 불러오는 중입니다.",
    },
    {
      id: "categories",
      title: "카테고리",
      content: product?.categories?.join(", ") || "카테고리 정보가 없습니다.",
    },
  ];

  if (isLoading) {
    return (
      <ProductDetailContainer>
        <div style={{ padding: "20px", textAlign: "center" }}>
          상품 정보를 불러오는 중입니다...
        </div>
      </ProductDetailContainer>
    );
  }

  if (error || !product) {
    return (
      <ProductDetailContainer>
        <div style={{ padding: "20px", textAlign: "center", color: "red" }}>
          상품 정보를 불러오는데 실패했습니다.
        </div>
      </ProductDetailContainer>
    );
  }

  return (
    <ProductDetailContainer>
      <ProductImageSection>
        <ProductImage
          src={product.images[currentImageIndex] || "/shirt.png"}
          alt={`${product.productName} - 이미지 ${currentImageIndex + 1}`}
          onClick={handleImageClick}
          style={{ cursor: product.images.length > 1 ? "pointer" : "default" }}
        />
        {product.images.length > 1 && (
          <PaginationDots>
            {product.images.map((_, index) => (
              <Dot
                key={index}
                active={index === currentImageIndex}
                onClick={() => handleImageDotClick(index)}
                style={{ cursor: "pointer" }}
              />
            ))}
          </PaginationDots>
        )}
        {product.images.length > 1 && (
          <div
            style={{
              position: "absolute",
              top: "10px",
              right: "10px",
              background: "rgba(0, 0, 0, 0.7)",
              color: "white",
              padding: "4px 8px",
              borderRadius: "12px",
              fontSize: "12px",
            }}
          >
            {currentImageIndex + 1} / {product.images.length}
          </div>
        )}
      </ProductImageSection>

      <ProductInfo>
        <ProductBrand>{product.storeName}</ProductBrand>
        <ProductName>{product.productName}</ProductName>
        <ProductPrice>{product.price.toLocaleString()}원</ProductPrice>
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
