import React, { useCallback, useRef, useEffect } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getPopularProducts, getNewestProducts } from "../../libs/api";
import ProductItem from "../productItem/ProductItem";
import type { Product } from "../../libs/api/types";
import { useTabFilter } from "../../libs/useTabFilter";

// 스켈레톤 UI 컴포넌트
function ProductSkeleton() {
  return (
    <div style={{ animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }}>
      <div style={{ 
        backgroundColor: '#e5e7eb', 
        borderRadius: '8px', 
        aspectRatio: '1', 
        marginBottom: '8px',
        width: '100%'
      }}></div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ 
          height: '12px', 
          backgroundColor: '#e5e7eb', 
          borderRadius: '4px', 
          width: '75%' 
        }}></div>
        <div style={{ 
          height: '12px', 
          backgroundColor: '#e5e7eb', 
          borderRadius: '4px', 
          width: '50%' 
        }}></div>
        <div style={{ 
          height: '16px', 
          backgroundColor: '#e5e7eb', 
          borderRadius: '4px', 
          width: '66%' 
        }}></div>
      </div>
    </div>
  );
}

// 스켈레톤 그리드 컴포넌트
function ProductSkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div
      style={{
        display: "grid",
        gap: "16px",
        justifyContent: "center",
        gridTemplateColumns: "repeat(3, 1fr)",
        padding: "16px"
      }}
    >
      {Array.from({ length: count }).map((_, index) => (
        <ProductSkeleton key={index} />
      ))}
    </div>
  );
}

export default function ProductList() {
  const tabs = ["인기순", "최신순"];
  const [activeTab] = useTabFilter(tabs, "tab");

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isFetching,
    error,
  } = useInfiniteQuery({
    queryKey: ["products", activeTab],
    queryFn: ({ pageParam }) => {
      console.log("Fetching page with param:", pageParam, "for tab:", activeTab);
      
      if (activeTab === "인기순") {
        return getPopularProducts({
          size: 21,
          ...(pageParam && {
            cursorId: pageParam.id,
            cursorLikes: pageParam.likes,
          }),
        });
      } else {
        // 최신순
        return getNewestProducts({
          size: 21,
          ...(pageParam && {
            cursorId: pageParam.id,
          }),
        });
      }
    },
    initialPageParam: undefined as { id: number; likes?: number } | undefined,
    getNextPageParam: (lastPage) => {
      console.log("Last page:", lastPage);
      if (!lastPage.hasNext) return undefined;
      return lastPage.nextCursor;
    },
  });

  const allProducts = data?.pages.flatMap((page) => page.content) ?? [];
  const observerRef = useRef<HTMLDivElement>(null);

  // 디버깅을 위한 로딩 상태 로그
  console.log("ProductList render - isLoading:", isLoading, "isFetching:", isFetching, "isFetchingNextPage:", isFetchingNextPage);

  // Intersection Observer를 사용한 무한 스크롤
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && hasNextPage && !isFetchingNextPage) {
          console.log("Intersection Observer triggered fetchNextPage");
          fetchNextPage();
        }
      },
      {
        rootMargin: "100px", // 100px 전에 미리 로드
        threshold: 0.1,
      }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  // 초기 로딩 또는 탭 변경 시 스켈레톤 UI 표시
  if (isLoading || (isFetching && allProducts.length === 0)) {
    console.log("Rendering skeleton UI for initial loading or tab change");
    return (
      <div className="flex-1 overflow-y-auto">
        <ProductSkeletonGrid count={9} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-red-500">상품을 불러오는데 실패했습니다.</div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div
        style={{
          display: "grid",
          gap: "16px",
          justifyContent: "center",
          gridTemplateColumns: "repeat(3, 1fr)",
        }}
      >
        {allProducts.map((product: Product, index: number) => (
          <ProductItem
            key={`${product.id}-${index}`}
            id={product.id}
            brand={product.storeName}
            title={product.productName}
            price={product.price}
            image={product.thumbnailUrl}
          />
        ))}
      </div>

      {/* Intersection Observer 타겟 */}
      <div ref={observerRef} style={{ height: "20px", marginTop: "20px" }} />

      {isFetchingNextPage && (
        <div className="mt-4">
          <ProductSkeletonGrid count={6} />
        </div>
      )}

      {!hasNextPage && allProducts.length > 0 && (
        <div className="flex items-center justify-center p-4 mt-4">
          <div className="text-gray-400">모든 상품을 불러왔습니다.</div>
        </div>
      )}

      {import.meta.env.DEV && (
        <div className="fixed bottom-4 right-4 bg-black/80 text-white p-2 rounded text-xs">
          <div>현재 탭: {activeTab}</div>
          <div>총 상품: {allProducts.length}</div>
          <div>다음 페이지: {hasNextPage ? "있음" : "없음"}</div>
          <div>로딩 중: {isFetchingNextPage ? "예" : "아니오"}</div>
          <div>초기 로딩: {isLoading ? "예" : "아니오"}</div>
          <div>탭 변경 로딩: {isFetching ? "예" : "아니오"}</div>
        </div>
      )}
    </div>
  );
}
