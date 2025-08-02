import ProductItem from "../productItem/ProductItem";
import { useEffect, useState } from "react";

/**
 * 상품 정보를 나타내는 타입입니다.
 */
type Product = {
  id: number;
  brand: string;
  title: string;
  price: number;
  image: string;
};

function ProductList() {
  const [products, setProducts] = useState<Product[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data: Product[]) => {
        setProducts(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>로딩 중...</div>;
  if (!products) return <div>상품이 없습니다.</div>;

  return (
    <div
      style={{
        display: "grid",
        gap: 16,
        justifyContent: "center",
        gridTemplateColumns: "repeat(3, 1fr)",
      }}
    >
      {products.map((product) => (
        <ProductItem
          key={product.id}
          id={product.id}
          brand={product.brand}
          title={product.title}
          price={product.price}
          image={product.image}
        />
      ))}
    </div>
  );
}

export default ProductList;
