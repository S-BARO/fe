import styled from "@emotion/styled";

export const GNBWrapper = styled.div`
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 450px;
  height: 81px;
  flex-shrink: 0; /* 축소 방지 - 하단 메뉴바가 잘리지 않도록 */
  display: flex;
  align-items: center;
  border-top: 1px solid #f3f4f6;
  background: #fff;
  padding-bottom: env(safe-area-inset-bottom, 0); /* iOS safe area 지원 */
  z-index: 100;
`;

export const IconButton = styled.button`
  display: flex;
  flex-direction: column;
  width: 20%;
  justify-content: center;
  align-items: center;
  background-color: transparent;
  border: none;
  cursor: pointer;
  padding: 6px 4px;
  gap: 2px;
  height: 100%;
  &:active {
    cursor: pointer;
  }
`;

export const TabLabel = styled.span<{ active: boolean }>`
  font-size: 10px;
  font-weight: 500;
  color: ${({ active }) => (active ? "#111" : "#9CA3AF")};
  line-height: 1;
  text-align: center;
  white-space: nowrap;
`;
