import styled from "@emotion/styled";
import { useState, useRef, useEffect } from "react";
import {
  getFittingSourceImages,
  createUploadUrl,
  completeImageUpload,
  createAiFitting,
  getCart,
} from "../../libs/api";
import type { FittingSourceImage, CartItemDto } from "../../libs/api";

const Container = styled.div`
  padding: 20px;
  background-color: #ffffff;
  min-height: 100vh;
`;

const InfoBanner = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const StarIcon = styled.div`
  width: 20px;
  height: 20px;
  background-color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: #667eea;
`;

const BannerText = styled.p`
  color: white;
  font-size: 14px;
  font-weight: 500;
  margin: 0;
  flex: 1;
`;

const SectionTitle = styled.h1`
  font-size: 24px;
  font-weight: bold;
  color: #000000;
  margin: 0 0 24px 0;
`;

const Card = styled.div<{ variant?: "primary" | "secondary" }>`
  background-color: ${(props) =>
    props.variant === "primary" ? "#f0f4ff" : "#ffffff"};
  border: 1px solid
    ${(props) => (props.variant === "primary" ? "#e0e7ff" : "#e5e7eb")};
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 16px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

const CardIcon = styled.div<{ variant?: "primary" | "secondary" }>`
  width: 48px;
  height: 48px;
  background-color: ${(props) =>
    props.variant === "primary" ? "#667eea" : "#667eea"};
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 20px;
`;

const CardContent = styled.div`
  flex: 1;
`;

const CardTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #000000;
  margin: 0 0 4px 0;
`;

const CardDescription = styled.p`
  font-size: 14px;
  color: #6b7280;
  margin: 0;
`;

const ArrowIcon = styled.div`
  width: 24px;
  height: 24px;
  color: #9ca3af;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const HiddenFileInput = styled.input`
  display: none;
`;

const SelectedImage = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 8px;
  object-fit: cover;
  border: 2px solid #667eea;
`;


const LoadingText = styled.div`
  font-size: 12px;
  color: #9ca3af;
  font-style: italic;
`;

const ExistingImageText = styled.div`
  font-size: 12px;
  color: #10b981;
  font-weight: 500;
`;

const UploadingText = styled.div`
  font-size: 12px;
  color: #f59e0b;
  font-weight: 500;
`;

const ErrorText = styled.div`
  font-size: 12px;
  color: #ef4444;
  font-weight: 500;
`;

const ProductModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ProductModalContent = styled.div`
  background-color: white;
  border-radius: 12px;
  padding: 20px;
  max-width: 90vw;
  max-height: 80vh;
  overflow-y: auto;
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-top: 16px;
`;

const ProductCard = styled.div<{ selected?: boolean }>`
  border: 2px solid ${(props) => (props.selected ? "#667eea" : "#e5e7eb")};
  border-radius: 8px;
  padding: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: ${(props) => (props.selected ? "#f0f4ff" : "white")};

  &:hover {
    border-color: #667eea;
    transform: translateY(-2px);
  }
`;

const ProductImage = styled.img`
  width: 100%;
  height: 120px;
  object-fit: cover;
  border-radius: 4px;
  margin-bottom: 8px;
`;

const ProductName = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #000000;
  margin-bottom: 4px;
`;

const ProductPrice = styled.div`
  font-size: 12px;
  color: #6b7280;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const ModalTitle = styled.h2`
  font-size: 18px;
  font-weight: bold;
  color: #000000;
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #6b7280;
`;

const ConfirmButton = styled.button`
  width: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 8px;
  padding: 12px;
  color: white;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 16px;
`;

const ResultModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1001;
`;

const ResultModalContent = styled.div`
  background-color: white;
  border-radius: 12px;
  padding: 20px;
  max-width: 90vw;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ResultImage = styled.img`
  max-width: 100%;
  max-height: 70vh;
  border-radius: 8px;
  margin-bottom: 16px;
`;

const SaveButton = styled.button`
  background: #10b981;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  margin-right: 12px;
  transition: all 0.2s ease;

  &:hover {
    background: #059669;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const ResultTitle = styled.h2`
  font-size: 18px;
  font-weight: bold;
  color: #000000;
  margin: 0 0 16px 0;
`;

const StartButton = styled.button`
  width: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 12px;
  padding: 16px 24px;
  color: white;
  font-size: 16px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 24px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
  }

  &:active {
    transform: translateY(0);
  }
`;

const LightningIcon = styled.div`
  width: 20px;
  height: 20px;
  background-color: white;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: #667eea;
`;

function BaroFittingPage() {
  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null);
  const [selectedOutfit, setSelectedOutfit] = useState<CartItemDto | null>(
    null
  );
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [existingImages, setExistingImages] = useState<FittingSourceImage[]>(
    []
  );
  const [isLoadingImages, setIsLoadingImages] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [cartItems, setCartItems] = useState<CartItemDto[]>([]);
  const [isLoadingCart, setIsLoadingCart] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<CartItemDto | null>(
    null
  );
  const [showResultModal, setShowResultModal] = useState(false);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 초기 이미지 조회
  useEffect(() => {
    const fetchExistingImages = async () => {
      try {
        setIsLoadingImages(true);
        const response = await getFittingSourceImages();
        setExistingImages(response.images);

        // 최신 이미지가 있으면 미리보기로 설정
        if (response.images.length > 0) {
          const latestImage = response.images[0]; // 업로드 일시 기준 내림차순 정렬
          setPhotoPreview(latestImage.imageUrl);
        }
      } catch (error) {
        console.error("이미지 조회 실패:", error);
        // 에러가 발생해도 기본 상태로 진행
      } finally {
        setIsLoadingImages(false);
      }
    };

    fetchExistingImages();
  }, []);

  const handlePhotoSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // 파일 유효성 검사
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

    if (file.size > maxSize) {
      setUploadError(
        "파일 크기가 너무 큽니다. 10MB 이하의 파일을 선택해주세요."
      );
      return;
    }

    if (!allowedTypes.includes(file.type)) {
      setUploadError(
        "지원하지 않는 파일 형식입니다. JPG, PNG, WEBP 파일만 업로드 가능합니다."
      );
      return;
    }

    try {
      setIsUploading(true);
      setUploadError(null);
      setSelectedPhoto(file);

      // 이미지 미리보기를 위한 URL 생성
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      // 1. Presigned URL 요청
      const uploadUrlResponse = await createUploadUrl();

      // 2. S3에 직접 업로드 (재시도 로직 포함)
      let uploadResponse;
      let retryCount = 0;
      const maxRetries = 3;

      while (retryCount < maxRetries) {
        try {
          uploadResponse = await fetch(uploadUrlResponse.presignedUrl, {
            method: "PUT",
            body: file,
          });

          if (uploadResponse.ok) {
            break; // 성공하면 루프 종료
          }

          const errorText = await uploadResponse.text();
          console.error(
            `S3 업로드 실패 (시도 ${retryCount + 1}/${maxRetries}):`,
            {
              status: uploadResponse.status,
              statusText: uploadResponse.statusText,
              errorText,
              fileSize: file.size,
              fileType: file.type,
              presignedUrl: uploadUrlResponse.presignedUrl,
            }
          );

          if (retryCount === maxRetries - 1) {
            throw new Error(
              `S3 업로드 실패 (${uploadResponse.status}): ${uploadResponse.statusText}`
            );
          }

          // 재시도 전 잠시 대기
          await new Promise((resolve) =>
            setTimeout(resolve, 1000 * (retryCount + 1))
          );
          retryCount++;
        } catch (error) {
          if (retryCount === maxRetries - 1) {
            throw error;
          }
          retryCount++;
          await new Promise((resolve) =>
            setTimeout(resolve, 1000 * retryCount)
          );
        }
      }

      // 3. 업로드 완료 API 호출
      await completeImageUpload(uploadUrlResponse.imageId);

      // 4. 이미지 목록 새로고침
      const updatedImages = await getFittingSourceImages();
      setExistingImages(updatedImages.images);

      // 5. 최신 이미지로 미리보기 업데이트
      if (updatedImages.images.length > 0) {
        setPhotoPreview(updatedImages.images[0].imageUrl);
      }
    } catch (error) {
      console.error("업로드 실패:", error);
      setUploadError("이미지 업로드에 실패했습니다. 다시 시도해주세요.");
      setSelectedPhoto(null);
      setPhotoPreview(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleOutfitSelect = async () => {
    try {
      setIsLoadingCart(true);
      const response = await getCart();
      setCartItems(response.items);
      setShowProductModal(true);
    } catch (error) {
      console.error("장바구니 조회 실패:", error);
      alert(
        "장바구니를 불러올 수 없습니다. 장바구니에 상품이 있는지 확인해주세요."
      );
    } finally {
      setIsLoadingCart(false);
    }
  };

  const handleProductSelect = (cartItem: CartItemDto) => {
    setSelectedProduct(cartItem);
  };

  const handleConfirmProduct = () => {
    if (selectedProduct) {
      setSelectedOutfit(selectedProduct);
      setShowProductModal(false);
    }
  };

  const handleCloseProductModal = () => {
    setShowProductModal(false);
    setSelectedProduct(null);
  };

  const handleStartFitting = async () => {
    if ((selectedPhoto || existingImages.length > 0) && selectedOutfit) {
      try {
        setIsGenerating(true);

        // 소스 이미지 URL 결정
        const sourceImageUrl = selectedPhoto
          ? photoPreview // 새로 선택한 이미지의 미리보기 URL
          : existingImages[0]?.imageUrl; // 기존 이미지 URL

        if (!sourceImageUrl) {
          throw new Error("소스 이미지가 없습니다.");
        }

        // AI 피팅 요청
        const resultBlob = await createAiFitting({
          sourceImageUrl,
          clothingImageUrl: selectedOutfit.productThumbnailUrl,
        });

        // 결과 이미지 URL 생성
        const resultUrl = URL.createObjectURL(resultBlob);
        setResultImage(resultUrl);
        setShowResultModal(true);
      } catch (error) {
        console.error("AI 피팅 생성 실패:", error);
        alert("AI 피팅 생성에 실패했습니다. 다시 시도해주세요.");
      } finally {
        setIsGenerating(false);
      }
    }
  };

  const handleCloseResultModal = () => {
    setShowResultModal(false);
    if (resultImage) {
      URL.revokeObjectURL(resultImage);
      setResultImage(null);
    }
  };

  const handleSaveImage = async () => {
    if (!resultImage) return;

    try {
      // 이미지를 Blob으로 변환
      const response = await fetch(resultImage);
      const blob = await response.blob();
      
      // 다운로드 링크 생성
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      // 파일명 생성 (현재 시간 기반)
      const now = new Date();
      const timestamp = now.toISOString().replace(/[:.]/g, '-');
      link.download = `ai-fitting-${timestamp}.jpg`;
      
      // 다운로드 실행
      document.body.appendChild(link);
      link.click();
      
      // 정리
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      // 성공 메시지 (선택사항)
      alert('사진이 저장되었습니다!');
    } catch (error) {
      console.error('이미지 저장 실패:', error);
      alert('사진 저장에 실패했습니다.');
    }
  };

  return (
    <Container>
      <InfoBanner>
        <StarIcon>★</StarIcon>
        <BannerText>
          전신이 전부 보이는 사진을 사용하면 더 자연스러운 결과가 나와요!
        </BannerText>
      </InfoBanner>

      <SectionTitle>AI 피팅</SectionTitle>

      <Card variant="primary" onClick={handlePhotoSelect}>
        {photoPreview ? (
          <SelectedImage src={photoPreview} alt="선택된 사진" />
        ) : (
          <CardIcon variant="primary">📷</CardIcon>
        )}
        <CardContent>
          <CardTitle>내 사진 선택</CardTitle>
          <CardDescription>앨범에서 전신 사진을 선택해주세요</CardDescription>
          {isLoadingImages ? (
            <LoadingText>기존 사진을 불러오는 중...</LoadingText>
          ) : isUploading ? (
            <UploadingText>사진을 업로드하는 중...</UploadingText>
          ) : uploadError ? (
            <ErrorText>{uploadError}</ErrorText>
          ) : photoPreview ? (
            <div>
              {existingImages.length > 0 && !selectedPhoto ? (
                <ExistingImageText>기존에 업로드된 사진</ExistingImageText>
              ) : (
                <span
                  style={{
                    fontSize: "12px",
                    color: "#667eea",
                    fontWeight: "500",
                  }}
                >
                  사진이 선택되었습니다
                </span>
              )}
            </div>
          ) : null}
        </CardContent>
        <ArrowIcon>›</ArrowIcon>
      </Card>

      <HiddenFileInput
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
      />

      <Card variant="secondary" onClick={handleOutfitSelect}>
        {selectedOutfit ? (
          <SelectedImage
            src={selectedOutfit.productThumbnailUrl}
            alt="선택된 옷"
          />
        ) : (
          <CardIcon variant="secondary">👕</CardIcon>
        )}
        <CardContent>
          <CardTitle>옷 선택</CardTitle>
          <CardDescription>장바구니에서 입어볼 옷을 선택해주세요</CardDescription>
          {selectedOutfit && (
            <div>
              <span
                style={{
                  fontSize: "12px",
                  color: "#667eea",
                  fontWeight: "500",
                }}
              >
                {selectedOutfit.productName}
              </span>
            </div>
          )}
        </CardContent>
        <ArrowIcon>›</ArrowIcon>
      </Card>

      <StartButton
        onClick={handleStartFitting}
        disabled={
          (!selectedPhoto && existingImages.length === 0) ||
          !selectedOutfit ||
          isUploading ||
          isGenerating
        }
        style={{
          opacity:
            (selectedPhoto || existingImages.length > 0) &&
            selectedOutfit &&
            !isUploading &&
            !isGenerating
              ? 1
              : 0.5,
          cursor:
            (selectedPhoto || existingImages.length > 0) &&
            selectedOutfit &&
            !isUploading &&
            !isGenerating
              ? "pointer"
              : "not-allowed",
        }}
      >
        <LightningIcon>⚡</LightningIcon>
        {isGenerating ? "옷을 입고 있어요..." : "AI 피팅 시작"}
      </StartButton>

      {/* 상품 선택 모달 */}
      {showProductModal && (
        <ProductModal onClick={handleCloseProductModal}>
          <ProductModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>옷 선택</ModalTitle>
              <CloseButton onClick={handleCloseProductModal}>×</CloseButton>
            </ModalHeader>

            {isLoadingCart ? (
              <div>장바구니를 불러오는 중...</div>
            ) : cartItems.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "40px 20px",
                  color: "#6b7280",
                }}
              >
                장바구니가 비어있습니다.
                <br />
                먼저 장바구니에 상품을 추가해주세요.
              </div>
            ) : (
              <>
                <ProductGrid>
                  {cartItems.map((cartItem) => (
                    <ProductCard
                      key={cartItem.itemId}
                      selected={selectedProduct?.itemId === cartItem.itemId}
                      onClick={() => handleProductSelect(cartItem)}
                    >
                      <ProductImage
                        src={cartItem.productThumbnailUrl}
                        alt={cartItem.productName}
                      />
                      <ProductName>{cartItem.productName}</ProductName>
                      <ProductPrice>
                        {cartItem.price.toLocaleString()}원 (수량:{" "}
                        {cartItem.quantity})
                      </ProductPrice>
                    </ProductCard>
                  ))}
                </ProductGrid>
                <ConfirmButton
                  onClick={handleConfirmProduct}
                  disabled={!selectedProduct}
                  style={{
                    opacity: selectedProduct ? 1 : 0.5,
                    cursor: selectedProduct ? "pointer" : "not-allowed",
                  }}
                >
                  선택 완료
                </ConfirmButton>
              </>
            )}
          </ProductModalContent>
        </ProductModal>
      )}

      {/* 결과 모달 */}
      {showResultModal && resultImage && (
        <ResultModal onClick={handleCloseResultModal}>
          <ResultModalContent onClick={(e) => e.stopPropagation()}>
            <ResultTitle>AI 피팅 결과</ResultTitle>
            <ResultImage src={resultImage} alt="AI 피팅 결과" />
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <SaveButton onClick={handleSaveImage}>저장하기</SaveButton>
              <CloseButton onClick={handleCloseResultModal}>닫기</CloseButton>
            </div>
          </ResultModalContent>
        </ResultModal>
      )}
    </Container>
  );
}

export default BaroFittingPage;
