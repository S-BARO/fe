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
  width: 20%;
  justify-content: center;
  align-items: center;
  background-color: transparent;
  border: none;
  cursor: pointer;
  &:active {
    cursor: pointer;
  }
`;
