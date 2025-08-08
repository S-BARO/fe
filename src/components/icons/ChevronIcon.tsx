import React from "react";

interface ChevronIconProps {
  size?: number;
  color?: string;
}

const ChevronIcon: React.FC<ChevronIconProps> = ({
  size = 16,
  color = "#4B5563",
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
    >
      <path
        d="M7.29377 12.7062C7.6844 13.0968 8.31877 13.0968 8.7094 12.7062L14.7094 6.70615C15.1 6.31553 15.1 5.68115 14.7094 5.29053C14.3188 4.8999 13.6844 4.8999 13.2938 5.29053L8.00002 10.5843L2.70627 5.29365C2.31565 4.90303 1.68127 4.90303 1.29065 5.29365C0.900024 5.68428 0.900024 6.31865 1.29065 6.70928L7.29065 12.7093L7.29377 12.7062Z"
        fill={color}
      />
    </svg>
  );
};

export default ChevronIcon;
