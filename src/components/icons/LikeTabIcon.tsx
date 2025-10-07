import React from "react";

interface LikeTabIconProps {
  active?: boolean;
}

const LikeTabIcon: React.FC<LikeTabIconProps> = ({ active = false }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/** Shirt silhouette */}
    <path
      d="M15.5 4.5l-3.5 1.8L8.5 4.5 5 7.5l2.5 2.3V20c0 .55.45 1 1 1h7c.55 0 1-.45 1-1v-10.2L19 7.5l-3.5-3z"
      fill={active ? "#111" : "#9CA3AF"}
    />
    {/** Magic wand (diagonal) */}
    <path
      d="M13.8 6.2l4 4-6.9 6.9-4-4 6.9-6.9z"
      fill={active ? "#111" : "#9CA3AF"}
      opacity="0.9"
    />
    {/** Sparkles near wand tip */}
    <path
      d="M18.75 4.5l.4 1.1 1.1.4-1.1.4-.4 1.1-.4-1.1-1.1-.4 1.1-.4.4-1.1zM20.2 8.7l.3.8.8.3-.8.3-.3.8-.3-.8-.8-.3.8-.3.3-.8z"
      fill={active ? "#111" : "#9CA3AF"}
    />
  </svg>
);

export default LikeTabIcon;
