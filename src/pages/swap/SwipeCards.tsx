// SwipeCards.tsx
import { useEffect, useMemo, useState } from "react";
import { useSpring, animated as a } from "@react-spring/web";
import { useGesture } from "@use-gesture/react";
import "./SwipeCards.css";
import { getSwipeLooks, putLookReaction } from "../../libs/api";
import type { SwipeLookItem, ReactionType } from "../../libs/api";

const PAGE_SIZE = 10; // 한 번에 가져올 카드 수
const PREFETCH_THRESHOLD = 3; // 이 수 이하로 남으면 추가 로드
const SWIPE_VELOCITY_THRESHOLD = 0.2; // 속도 기준
const SWIPE_DISTANCE_THRESHOLD_PX = 200; // 거리 기준(픽셀)

function SwipeCards() {
  const [cards, setCards] = useState<SwipeLookItem[]>([]);
  const [index, setIndex] = useState(0);
  const [nextCursor, setNextCursor] = useState<number | undefined>(undefined);
  const [hasNext, setHasNext] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const [{ x, rot, scale }, api] = useSpring(() => ({
    x: 0,
    rot: 0,
    scale: 1,
    config: { tension: 300, friction: 30 },
  }));

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

  const sendReaction = async (lookId: number, reactionType: ReactionType) => {
    try {
      await putLookReaction(lookId, { reactionType });
    } catch (e) {
      // 멱등 API이므로 실패해도 UX 끊김 없이 진행
      console.error("putLookReaction error", e);
    }
  };

  const onSwipeLeft = (lookId: number) => {
    void sendReaction(lookId, "DISLIKE");
  };

  const onSwipeRight = (lookId: number) => {
    void sendReaction(lookId, "LIKE");
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

  const visibleCard = useMemo(() => cards[index], [cards, index]);

  return (
    <div className="card-container">
      {visibleCard ? (
        <a.div
          key={visibleCard.lookId}
          className="card"
          style={{ x, rotateZ: rot, scale, backgroundColor: "#fcfcfc" }}
          {...bind()}
        >
          <img
            src={visibleCard.thumbnailUrl}
            alt={visibleCard.title}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              borderRadius: 20,
            }}
          />
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
    </div>
  );
}

export default SwipeCards;
