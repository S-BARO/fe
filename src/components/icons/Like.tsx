/**
 * 하트(좋아요) 아이콘 컴포넌트입니다.
 *
 * @param selected - 선택(활성) 상태 여부입니다. true면 빨간 하트, false면 빈 하트가 표시됩니다.
 * @param css - emotion css prop으로, svg에 스타일을 적용할 수 있습니다.
 */
import React from "react";

interface LikeIconProps {
  /** 선택(활성) 상태 여부 */
  selected?: boolean;
}

const LikeIcon: React.FC<LikeIconProps> = ({ selected = false }) =>
  selected ? (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
        fill="#EF4444"
      />
    </svg>
  ) : (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
        fill="none"
        stroke="#6e6e6e"
        strokeWidth="1.5"
      />
    </svg>
  );

export default LikeIcon;
