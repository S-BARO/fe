// SwipeCards.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import { useSpring, animated as a } from "@react-spring/web";
import { useGesture } from "@use-gesture/react";
import "./SwipeCards.css";
import { getSwipeLooks, putLookReaction, deleteLookReaction, getLookDetail } from "../../libs/api";
import type { SwipeLookItem, ReactionType, LookDetailResponse } from "../../libs/api";

const PAGE_SIZE = 10; // 한 번에 가져올 카드 수
const PREFETCH_THRESHOLD = 3; // 이 수 이하로 남으면 추가 로드
const SWIPE_VELOCITY_THRESHOLD = 0.2; // 속도 기준
const SWIPE_DISTANCE_THRESHOLD_PX = 200; // 거리 기준(픽셀)

const OVERLAY_VISIBLE_MS = 500; // 반응 오버레이 표시 시간
const OVERLAY_FADE_MS = 250; // 반응 오버레이 페이드 시간
const TOAST_DURATION_MS = 1600; // 토스트 표시 시간

type HistoryItem = { lookId: number; reactionType: ReactionType; prevIndex: number };

function SwipeCards() {
  const [cards, setCards] = useState<SwipeLookItem[]>([]);
  const [index, setIndex] = useState(0);
  const [nextCursor, setNextCursor] = useState<number | undefined>(undefined);
  const [hasNext, setHasNext] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  // 현재 카드 상세 정보
  const [lookDetail, setLookDetail] = useState<LookDetailResponse | null>(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);

  // 반응 요청 중복/연타 방지 및 낙관적 업데이트 관리
  const reactionInFlightRef = useRef<Set<number>>(new Set());
  const reactedLookIdsRef = useRef<Set<number>>(new Set());
  const optimisticLikedIdsRef = useRef<Set<number>>(new Set());

  // 반응 오버레이/토스트 상태
  const [reactionOverlay, setReactionOverlay] = useState<null | "LIKE" | "DISLIKE">(null);
  const overlayTimerRef = useRef<number | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimerRef = useRef<number | null>(null);

  // 스와이프 되돌리기 히스토리
  const [history, setHistory] = useState<HistoryItem[]>([]);

  const [{ x, rot, scale }, api] = useSpring(() => ({
    x: 0,
    rot: 0,
    scale: 1,
    config: { tension: 300, friction: 30 },
  }));

  const prefetchImages = (urls: string[]) => {
    urls.forEach((url) => {
      const img = new Image();
      img.src = url;
    });
  };

  const fetchMore = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      const data = await getSwipeLooks({
        cursorId: nextCursor,
        size: PAGE_SIZE,
      });
      setCards((prev) => [...prev, ...data.content]);
      setHasNext(data.hasNext);
      setNextCursor(data.nextCursor?.id);

      // 새로 받은 이미지 프리페치
      prefetchImages(data.content.map((i) => i.thumbnailUrl));
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // 초기 로드
    fetchMore();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 카드 변경 시 이미지 로딩 상태 초기화
  useEffect(() => {
    setIsImageLoaded(false);
  }, [index]);

  // 현재 보이는 카드 상세 불러오기
  const visibleCard = useMemo(() => cards[index], [cards, index]);
  useEffect(() => {
    let cancelled = false;
    const loadDetail = async () => {
      if (!visibleCard) {
        setLookDetail(null);
        return;
      }
      setIsDetailLoading(true);
      try {
        const detail = await getLookDetail(visibleCard.lookId);
        if (cancelled) return;
        setLookDetail(detail);
        // 상세 이미지도 프리페치
        prefetchImages(detail.images.map((img) => img.imageUrl));
      } catch (e) {
        if (!cancelled) console.error(e);
      } finally {
        if (!cancelled) setIsDetailLoading(false);
      }
    };
    void loadDetail();
    return () => {
      cancelled = true;
    };
  }, [visibleCard]);

  // 언마운트 시 타이머 정리
  useEffect(() => {
    return () => {
      if (overlayTimerRef.current) window.clearTimeout(overlayTimerRef.current);
      if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
    };
  }, []);

  const showReactionOverlay = (kind: "LIKE" | "DISLIKE") => {
    setReactionOverlay(kind);
    if (overlayTimerRef.current) window.clearTimeout(overlayTimerRef.current);
    overlayTimerRef.current = window.setTimeout(() => {
      setReactionOverlay(null);
    }, OVERLAY_VISIBLE_MS + OVERLAY_FADE_MS);
  };

  const showToast = (message: string) => {
    setToastMessage(message);
    if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
    toastTimerRef.current = window.setTimeout(() => {
      setToastMessage(null);
    }, TOAST_DURATION_MS);
  };

  const sendReaction = async (lookId: number, reactionType: ReactionType) => {
    // 중복/연타 방지: 동일 lookId에 대한 중복 요청 차단
    if (
      reactionInFlightRef.current.has(lookId) ||
      reactedLookIdsRef.current.has(lookId)
    ) {
      return;
    }

    // 낙관적 업데이트 (LIKE만 증가)
    if (reactionType === "LIKE" && !optimisticLikedIdsRef.current.has(lookId)) {
      setCards((prev) =>
        prev.map((item) =>
          item.lookId === lookId
            ? { ...item, likesCount: (item.likesCount ?? 0) + 1 }
            : item
        )
      );
      optimisticLikedIdsRef.current.add(lookId);
    }

    reactionInFlightRef.current.add(lookId);
    try {
      await putLookReaction(lookId, { reactionType });
      reactedLookIdsRef.current.add(lookId);
      showToast(reactionType === "LIKE" ? "좋아요가 반영되었어요" : "싫어요가 반영되었어요");
    } catch (e) {
      console.error("putLookReaction error", e);
      showToast("반응 처리에 실패했어요");
    } finally {
      reactionInFlightRef.current.delete(lookId);
    }
  };

  const onSwipeLeft = (lookId: number) => {
    showReactionOverlay("DISLIKE");
    void sendReaction(lookId, "DISLIKE");
  };

  const onSwipeRight = (lookId: number) => {
    showReactionOverlay("LIKE");
    void sendReaction(lookId, "LIKE");
  };

  const handleUndo = async () => {
    const last = history[history.length - 1];
    if (!last) return;

    // 진행 중인 요청이면 잠시 후 재시도 안내
    if (reactionInFlightRef.current.has(last.lookId)) {
      showToast("이전 반응 처리 중입니다. 잠시 후 다시 시도해주세요.");
      return;
    }

    // UI 먼저 되돌리고 서버에 취소 요청 (낙관적 롤백)
    setHistory((prev) => prev.slice(0, -1));
    setIndex(last.prevIndex);

    if (last.reactionType === "LIKE") {
      setCards((prev) =>
        prev.map((item) =>
          item.lookId === last.lookId
            ? { ...item, likesCount: Math.max(0, (item.likesCount ?? 0) - 1) }
            : item
        )
      );
      optimisticLikedIdsRef.current.delete(last.lookId);
    }

    reactedLookIdsRef.current.delete(last.lookId);

    try {
      await deleteLookReaction(last.lookId);
      showToast("이전 반응을 취소했어요");
    } catch (e) {
      console.error("deleteLookReaction error", e);
      showToast("반응 취소에 실패했어요");
    }
  };

  const bind = useGesture({
    onDrag: ({ down, movement: [mx], direction: [xDir], velocity }) => {
      const velocityTrigger = Math.abs(velocity[0]) > SWIPE_VELOCITY_THRESHOLD;
      const distanceTrigger = Math.abs(mx) > SWIPE_DISTANCE_THRESHOLD_PX;
      const trigger = velocityTrigger || distanceTrigger;

      const dir = xDir < 0 ? -1 : 1;

      if (!down && trigger) {
        const currentCard = cards[index];
        if (currentCard) {
          if (dir === -1) {
            onSwipeLeft(currentCard.lookId);
          } else {
            onSwipeRight(currentCard.lookId);
          }
          // 히스토리 저장 (되돌리기)
          setHistory((prev) => [
            ...prev,
            {
              lookId: currentCard.lookId,
              reactionType: dir === -1 ? "DISLIKE" : "LIKE",
              prevIndex: index,
            },
          ]);
        }

        const nextIndex = index + 1;
        setIndex(nextIndex);

        // 잔량이 임계치 이하면 다음 페이지 미리 로드
        if (cards.length - nextIndex <= PREFETCH_THRESHOLD && hasNext) {
          void fetchMore();
        }
      }

      api.start({
        x: down ? mx : !down && trigger ? dir * 500 : 0,
        rot: down ? mx / 100 : 0,
        scale: down ? 1.1 : 1,
      });
    },
  });

  return (
    <>
      <div className="card-container">
        {visibleCard ? (
          <a.div
            key={visibleCard.lookId}
            className="card"
            style={{ x, rotateZ: rot, scale, backgroundColor: "#fcfcfc" }}
            {...bind()}
          >
            {/* 스켈레톤 */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "#e5e7eb",
                borderRadius: 20,
                opacity: isImageLoaded ? 0 : 1,
                transition: `opacity ${OVERLAY_FADE_MS}ms ease-in-out`,
              }}
            />

            {/* 썸네일 이미지 (페이드 인 + 폴백) */}
            <img
              src={visibleCard.thumbnailUrl}
              alt={visibleCard.title}
              onLoad={() => setIsImageLoaded(true)}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = "/shirt.png";
                setIsImageLoaded(true);
              }}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: 20,
                opacity: isImageLoaded ? 1 : 0,
                transition: `opacity ${OVERLAY_FADE_MS}ms ease-in-out`,
              }}
            />

            {/* 좋아요 카운트 표시 (있을 때만) */}
            {typeof visibleCard.likesCount === "number" && (
              <div
                style={{
                  position: "absolute",
                  bottom: 12,
                  right: 12,
                  background: "rgba(0,0,0,0.6)",
                  color: "#fff",
                  padding: "4px 8px",
                  borderRadius: 12,
                  fontSize: 12,
                }}
              >
                ❤️ {visibleCard.likesCount}
              </div>
            )}
          </a.div>
        ) : (
          <div
            className="card"
            style={{
              backgroundColor: "#f3f4f6",
              color: "#6b7280",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {isLoading
              ? "불러오는 중..."
              : hasNext
                ? "더 불러오는 중..."
                : "더 이상 항목이 없습니다"}
          </div>
        )}

        {/* 반응 오버레이 (카드와 독립적으로 화면 중앙에 표시) */}
        {reactionOverlay && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              pointerEvents: "none",
            }}
          >
            <div
              style={{
                padding: "8px 14px",
                borderRadius: 12,
                fontWeight: 700,
                fontSize: 18,
                color: "#fff",
                background:
                  reactionOverlay === "LIKE" ? "rgba(16, 185, 129, 0.8)" : "rgba(239, 68, 68, 0.85)",
                opacity: 1,
                transform: "scale(1)",
                transition: `opacity ${OVERLAY_FADE_MS}ms ease-in-out`,
              }}
            >
              {reactionOverlay === "LIKE" ? "좋아요" : "싫어요"}
            </div>
          </div>
        )}

        {/* 되돌리기 버튼 */}
        {history.length > 0 && (
          <button
            type="button"
            onClick={() => void handleUndo()}
            style={{
              position: "fixed",
              left: 16,
              bottom: 20,
              background: "#111827",
              color: "#fff",
              padding: "10px 12px",
              borderRadius: 12,
              fontSize: 13,
              boxShadow: "0 6px 20px rgba(0,0,0,0.25)",
              zIndex: 51,
              border: "none",
            }}
          >
            되돌리기
          </button>
        )}

        {/* 토스트 */}
        {toastMessage && (
          <div
            style={{
              position: "fixed",
              left: "50%",
              bottom: 24,
              transform: "translateX(-50%)",
              background: "rgba(31, 41, 55, 0.92)",
              color: "#fff",
              padding: "10px 14px",
              borderRadius: 12,
              fontSize: 13,
              boxShadow: "0 6px 20px rgba(0,0,0,0.25)",
              zIndex: 50,
            }}
          >
            {toastMessage}
          </div>
        )}
      </div>

      {/* 구성 상품 리스트 */}
      <div style={{ padding: "12px 16px" }}>
        <h3 style={{ margin: "0 0 8px", fontSize: 16, fontWeight: 600 }}>구성 상품</h3>
        {isDetailLoading ? (
          <div style={{ color: "#6b7280", fontSize: 13 }}>불러오는 중...</div>
        ) : lookDetail && lookDetail.products && lookDetail.products.length > 0 ? (
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 12 }}>
            {lookDetail.products
              .slice()
              .sort((a, b) => a.displayOrder - b.displayOrder)
              .map((p) => (
                <li key={p.productId} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <img
                    src={p.thumbnailUrl}
                    alt={p.name}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = "/shirt.png";
                    }}
                    style={{ width: 60, height: 60, borderRadius: 8, objectFit: "cover", background: "#f3f4f6" }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.name}</div>
                    <div style={{ fontSize: 13, color: "#6b7280", marginTop: 2 }}>
                      {p.price.toLocaleString()}원
                    </div>
                  </div>
                </li>
              ))}
          </ul>
        ) : (
          <div style={{ color: "#6b7280", fontSize: 13 }}>구성 상품이 없습니다</div>
        )}
      </div>
    </>
  );
}

export default SwipeCards;
