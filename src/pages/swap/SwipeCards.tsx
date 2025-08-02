// SwipeCards.tsx
import { useState } from "react";
import { useSpring, animated as a } from "@react-spring/web";
import { useGesture } from "@use-gesture/react";
import "./SwipeCards.css";

const cards = [
  { id: 1, text: "Card 1", bg: "#ff6b6b" },
  { id: 2, text: "Card 2", bg: "#feca57" },
  { id: 3, text: "Card 3", bg: "#1dd1a1" },
];

function SwipeCards() {
  const [index, setIndex] = useState(0);

  const [{ x, rot, scale }, api] = useSpring(() => ({
    x: 0,
    rot: 0,
    scale: 1,
    config: { tension: 300, friction: 30 },
  }));

  // 왼쪽 스와이프 시 실행할 함수
  const onSwipeLeft = (cardId: number) => {
    console.log(`카드 ${cardId}를 싫어요 버튼을 눌렀습니다!`);
    // 여기에 왼쪽 스와이프 시 실행할 로직 추가
    // 예: 좋아요, 관심 있음 등
  };

  // 오른쪽 스와이프 시 실행할 함수
  const onSwipeRight = (cardId: number) => {
    console.log(`카드 ${cardId}를 좋아요 버튼을 눌렀습니다!`);
    // 여기에 오른쪽 스와이프 시 실행할 로직 추가
    // 예: 관심 없음, 건너뛰기 등
  };

  const bind = useGesture({
    onDrag: ({ down, movement: [mx], direction: [xDir], velocity }) => {
      // 스와이프 판정 기준
      const velocityThreshold = 0.2; // 속도 기준
      const distanceThreshold = 200; // 거리 기준 (픽셀)

      // 속도 또는 거리 중 하나라도 기준을 만족하면 스와이프 완료
      const velocityTrigger = Math.abs(velocity[0]) > velocityThreshold;
      const distanceTrigger = Math.abs(mx) > distanceThreshold;
      const trigger = velocityTrigger || distanceTrigger;

      const dir = xDir < 0 ? -1 : 1;

      if (!down && trigger) {
        // 스와이프 방향에 따라 다른 함수 실행
        const currentCard = cards[index];
        if (dir === -1) {
          // 왼쪽으로 스와이프
          onSwipeLeft(currentCard.id);
        } else {
          // 오른쪽으로 스와이프
          onSwipeRight(currentCard.id);
        }

        // 다음 카드로 이동
        setIndex((prev) => (prev + 1 < cards.length ? prev + 1 : 0));
      }

      api.start({
        x: down ? mx : !down && trigger ? dir * 500 : 0,
        rot: down ? mx / 100 : 0,
        scale: down ? 1.1 : 1,
      });
    },
  });

  return (
    <div className="card-container">
      {cards.slice(index, index + 1).map(({ id, text, bg }) => (
        <a.div
          key={id}
          className="card"
          style={{
            backgroundColor: bg,
            x,
            rotateZ: rot,
            scale,
          }}
          {...bind()}
        >
          {text}
        </a.div>
      ))}
    </div>
  );
}

export default SwipeCards;
