import styled from "@emotion/styled";

export const HeaderBar = styled.header`
  maxwidth: 390px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-inline: 16px;
  border-bottom: 1px solid #f3f4f6;
`;

export const HeaderLogo = styled.img`
  width: 53px;
  height: 24px;
  cursor: pointer;
`;

export const HeaderSearchIcon = styled.img`
  width: 34px;
  height: 44px;
  cursor: pointer;
`;

export const HeaderFilterWrapper = styled.div`
  width: 100%;
`;
