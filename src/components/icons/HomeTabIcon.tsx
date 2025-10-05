import React from "react";

/**
 * 홈 탭 아이콘 컴포넌트입니다.
 *
 * @param active - true면 아이콘이 검정색(활성), false면 회색(비활성)입니다.
 */
interface HomeTabIconProps {
  active?: boolean;
}

const HomeTabIcon: React.FC<HomeTabIconProps> = ({ active = false }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="flex justify-center items-center"
  >
    <path
      d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"
      fill={active ? "#111" : "#9CA3AF"}
    />
  </svg>
);

export default HomeTabIcon;
