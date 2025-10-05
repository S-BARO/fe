import styled from "@emotion/styled";

export const GNBWrapper = styled.div`
  width: 100%;
  height: 81px;
  display: flex;
  align-items: center;
  border-top: 1px solid #f3f4f6;
  background: #fff;
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
