import { useState, useRef, useEffect } from "react";
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
  
  // productId 유효성 검사
  const parsedId = parseInt(id || "", 10);
  const productId = Number.isInteger(parsedId) && parsedId > 0 ? parsedId : null;

  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
  const [isLiked, setIsLiked] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // 터치 슬라이드 관련 상태
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const {
    data: product,
    isLoading,
    error,
  } = useQuery({
    queryKey: productId != null ? ["product", productId] : ["product"],
    queryFn: () => getProductDetail(productId!),
    enabled: productId != null,
  });

  // product나 images.length가 변경될 때 currentImageIndex 관리
  useEffect(() => {
    if (!product) {
      setCurrentImageIndex(0);
      return;
    }

    const imagesLength = product.images?.length ?? 0;
    
    if (imagesLength === 0) {
      setCurrentImageIndex(0);
    } else {
      // currentImageIndex를 이미지 배열 범위 내로 클램핑
      setCurrentImageIndex(prev => Math.max(0, Math.min(prev, imagesLength - 1)));
    }
  }, [product, product?.images?.length]);

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
    const images = product?.images ?? [];
    const imagesLength = images.length;
    if (imagesLength > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % imagesLength);
    }
  };

  // 터치 이벤트 핸들러
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (touchStart == null || touchEnd == null || !product?.images?.length) return;
    
    const images = product?.images ?? [];
    const imagesLength = images.length;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && currentImageIndex < imagesLength - 1) {
      setCurrentImageIndex(prev => prev + 1);
    }
    if (isRightSwipe && currentImageIndex > 0) {
      setCurrentImageIndex(prev => prev - 1);
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

  const images = product?.images ?? [];
  const imagesLength = images.length;

  return (
    <ProductDetailContainer>
      <ProductImageSection>
        {imagesLength > 0 ? (
          <>
            <ProductImage
              ref={imageRef}
              src={images[currentImageIndex] || "/shirt.png"}
              alt={`${product.productName} - 이미지 ${currentImageIndex + 1}`}
              onClick={handleImageClick}
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
              style={{ cursor: imagesLength > 1 ? "pointer" : "default" }}
            />
            {imagesLength > 1 && (
              <PaginationDots>
                {images.map((_, index) => (
                  <Dot
                    key={index}
                    active={index === currentImageIndex}
                    onClick={() => handleImageDotClick(index)}
                    style={{ cursor: "pointer" }}
                  />
                ))}
              </PaginationDots>
            )}
            {imagesLength > 1 && (
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
                {currentImageIndex + 1} / {imagesLength}
              </div>
            )}
          </>
        ) : (
          <div
            style={{
              width: "320px",
              height: "384px",
              backgroundColor: "#f3f4f6",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#6b7280",
            }}
          >
            이미지가 없습니다
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
