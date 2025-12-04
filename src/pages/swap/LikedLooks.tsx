import { useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getLikedLooks } from "../../libs/api";
import type { LikedLookItem } from "../../libs/api";

// 스켈레톤 UI 컴포넌트
function LookSkeleton() {
  return (
    <div
      style={{
        animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        aspectRatio: "9/16",
        backgroundColor: "#e5e7eb",
        borderRadius: "12px",
        width: "100%",
      }}
    />
  );
}

// 스켈레톤 그리드 컴포넌트
function LookSkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "12px",
      }}
    >
      {Array.from({ length: count }).map((_, index) => (
        <LookSkeleton key={index} />
      ))}
    </div>
  );
}

// 룩 아이템 컴포넌트
function LookItem({ look }: { look: LikedLookItem }) {
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate(`/product/${look.lookId}`);
  };

  return (
    <div
      onClick={handleClick}
      style={{
        aspectRatio: "9/16",
        borderRadius: "12px",
        overflow: "hidden",
        cursor: "pointer",
        position: "relative",
        transition: "transform 0.2s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "scale(1.02)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "scale(1)";
      }}
    >
      <img
        src={look.thumbnailUrl}
        alt={look.title}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
        onError={(e) => {
          e.currentTarget.src = "/shirt.png";
        }}
      />
      {/* 오버레이 */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          background: "linear-gradient(transparent, rgba(0,0,0,0.7))",
          padding: "8px",
          color: "white",
          fontSize: "12px",
          fontWeight: "500",
        }}
      >
        {look.title}
      </div>
    </div>
  );
}

export default function LikedLooks() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useInfiniteQuery({
    queryKey: ["likedLooks"],
    queryFn: ({ pageParam }) => {
      console.log("Fetching liked looks with param:", pageParam);
      return getLikedLooks({
        size: 21,
        ...(pageParam && { cursorId: pageParam.id }),
      });
    },
    initialPageParam: undefined as { id: number } | undefined,
    getNextPageParam: (lastPage) => {
      console.log("Last page:", lastPage);
      if (!lastPage.hasNext) return undefined;
      return lastPage.nextCursor;
    },
  });

  const allLooks = data?.pages.flatMap((page) => page.content) ?? [];
  const observerRef = useRef<HTMLDivElement>(null);

  // Intersection Observer를 사용한 무한 스크롤
  useEffect(() => {
    const currentTarget = observerRef.current;
    if (!currentTarget) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          console.log("Loading next page...");
          fetchNextPage();
        }
      },
      {
        threshold: 0.1,
        rootMargin: "100px", // 100px 전에 미리 로드
      }
    );

    observer.observe(currentTarget);

    return () => {
      observer.disconnect();
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage, allLooks.length]);

  // 로딩 상태
  if (isLoading) {
    return (
      <div style={{ padding: "20px 0" }}>
        <LookSkeletonGrid count={6} />
      </div>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "200px",
          color: "#6b7280",
        }}
      >
        좋아요한 룩을 불러오는데 실패했습니다.
      </div>
    );
  }

  // 빈 상태
  if (allLooks.length === 0) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "300px",
          color: "#6b7280",
          gap: "12px",
        }}
      >
        <div style={{ fontSize: "48px" }}>💔</div>
        <div style={{ fontSize: "16px", fontWeight: "500" }}>
          아직 좋아요한 룩이 없어요
        </div>
        <div style={{ fontSize: "14px" }}>
          스와이프에서 마음에 드는 룩을 좋아요해보세요!
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "12px",
          padding: "0 12px 12px 12px",
        }}
      >
        {allLooks.map((look: LikedLookItem, index: number) => (
          <LookItem key={`${look.lookId}-${index}`} look={look} />
        ))}
      </div>

      {/* Intersection Observer 타겟 */}
      <div ref={observerRef} style={{ height: "20px", marginTop: "20px" }} />

      {isFetchingNextPage && (
        <div style={{ padding: "0 12px 12px 12px" }}>
          <LookSkeletonGrid count={6} />
        </div>
      )}

      {!hasNextPage && allLooks.length > 0 && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "20px",
            color: "#9ca3af",
            fontSize: "14px",
          }}
        >
          모든 룩을 불러왔습니다.
        </div>
      )}

      {import.meta.env.DEV && (
        <div className="fixed bottom-4 right-4 bg-black/80 text-white p-2 rounded text-xs z-50">
          <div>총 룩: {allLooks.length}</div>
          <div>다음 페이지: {hasNextPage ? "있음" : "없음"}</div>
          <div>로딩 중: {isFetchingNextPage ? "예" : "아니오"}</div>
          <div>초기 로딩: {isLoading ? "예" : "아니오"}</div>
        </div>
      )}
    </>
  );
}
