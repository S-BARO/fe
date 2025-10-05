import React from "react";

/**
 * 마이페이지 탭 아이콘 컴포넌트입니다.
 *
 * @param active - true면 아이콘이 검정색(활성), false면 회색(비활성)입니다.
 */
interface MypageTabIconProps {
  active?: boolean;
}

const MypageTabIcon: React.FC<MypageTabIconProps> = ({ active = false }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
      fill={active ? "#111" : "#9CA3AF"}
    />
  </svg>
);

export default MypageTabIcon;
