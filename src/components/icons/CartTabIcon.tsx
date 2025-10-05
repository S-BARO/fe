import React from "react";

interface CartTabIconProps {
  active?: boolean;
}

const CartTabIcon: React.FC<CartTabIconProps> = ({ active = false }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M7 4V2a1 1 0 0 1 2 0v2h6V2a1 1 0 0 1 2 0v2h2a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2zm-2 4v10h14V8H5zm3 3a1 1 0 0 0 0 2h8a1 1 0 0 0 0-2H8z"
      fill={active ? "#111" : "#9CA3AF"}
    />
  </svg>
);

export default CartTabIcon;


