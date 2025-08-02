// src/libs/productsDb.ts

/**
 * 상품 더미 데이터 (mock DB) - 30개
 */
export const productsDb = Array.from({ length: 29 }, (_, i) => {
  const id = i + 1;
  return {
    id,
    brand: id % 2 === 0 ? "무신사 스탠다드" : "유니클로",
    title: `상품 ${id}번 티셔츠`,
    price: 19900 + (id % 5) * 5000,
    image: "/shirt.png",
  };
}); 