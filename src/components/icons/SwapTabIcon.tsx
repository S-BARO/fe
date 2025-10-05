import React from "react";

/**
 * 카테고리 탭 화살표 아이콘 컴포넌트입니다.
 *
 * @param active - true면 아이콘이 검정색(활성), false면 회색(비활성)입니다.
 */
interface SwapTabIconProps {
  active?: boolean;
}

const SwapTabIcon: React.FC<SwapTabIconProps> = ({ active = false }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M7 4V2a1 1 0 0 1 2 0v2h2a1 1 0 0 1 0 2H9v2a1 1 0 0 1-2 0V6H5a1 1 0 0 1 0-2h2zm12 12a1 1 0 0 1-1 1h-2v2a1 1 0 0 1-2 0v-2h-2a1 1 0 0 1 0-2h2v-2a1 1 0 0 1 2 0v2h2a1 1 0 0 1 1 1zm-4-8a1 1 0 0 0-1-1H9v2h5a1 1 0 0 0 1-1zm-6 4a1 1 0 0 0 1 1h5v-2H9a1 1 0 0 0-1 1z"
      fill={active ? "#111" : "#9CA3AF"}
    />
  </svg>
);

export default SwapTabIcon;
