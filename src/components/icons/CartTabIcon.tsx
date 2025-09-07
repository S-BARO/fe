import React from "react";

interface CartTabIconProps {
  active?: boolean;
}

const CartTabIcon: React.FC<CartTabIconProps> = ({ active = false }) => (
  <svg
    width="21"
    height="64"
    viewBox="0 0 21 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M2.5 20.5H5.2L7.1 29.8C7.2712 30.6417 8.0011 31.25 8.86 31.25H16.2C17.0589 31.25 17.7888 30.6417 17.96 29.8L19 24.75C19.1712 23.9083 18.4411 23.3 17.5822 23.3H7.9"
      stroke={active ? "#111" : "#9CA3AF"}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="8.8" cy="34.5" r="1.7" fill={active ? "#111" : "#9CA3AF"} />
    <circle cx="16.2" cy="34.5" r="1.7" fill={active ? "#111" : "#9CA3AF"} />
  </svg>
);

export default CartTabIcon;


