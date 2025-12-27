"use client";

import { useRouter, usePathname } from "next/navigation";
import HomeTabIcon from "../icons/HomeTabIcon";
import LikeTabIcon from "../icons/LikeTabIcon";
import MypageTabIcon from "../icons/MypageTabIcon";
import SwapTabIcon from "../icons/SwapTabIcon";
import CartTabIcon from "../icons/CartTabIcon";
import { GNBWrapper, IconButton } from "./styles";
import styled from "@emotion/styled";

const TabLabel = styled.span<{ active: boolean }>`
  font-size: 10px;
  font-weight: 500;
  color: ${({ active }) => (active ? "#111" : "#9CA3AF")};
  line-height: 1.2;
  text-align: center;
`;

function GNB() {
  const router = useRouter();
  const pathname = usePathname();

  // 현재 경로에 따라 active 상태를 결정
  const isHome = pathname === "/";
  const isSwap = pathname?.startsWith("/swap");
  const isLike = pathname?.startsWith("/baro-fitting");
  const isCart = pathname?.startsWith("/cart");
  const isMypage = pathname?.startsWith("/my");

  return (
    <GNBWrapper>
      <IconButton onClick={() => router.push("/baro-fitting")}>
        <LikeTabIcon active={isLike} />
        <TabLabel active={isLike}>AI 피팅</TabLabel>
      </IconButton>
      <IconButton onClick={() => router.push("/swap")}>
        <SwapTabIcon active={isSwap} />
        <TabLabel active={isSwap}>스왑</TabLabel>
      </IconButton>
      <IconButton onClick={() => router.push("/")}>
        <HomeTabIcon active={isHome} />
        <TabLabel active={isHome}>홈</TabLabel>
      </IconButton>
      <IconButton onClick={() => router.push("/cart")}>
        <CartTabIcon active={isCart} />
        <TabLabel active={isCart}>장바구니</TabLabel>
      </IconButton>
      <IconButton onClick={() => router.push("/my")}>
        <MypageTabIcon active={isMypage} />
        <TabLabel active={isMypage}>마이</TabLabel>
      </IconButton>
    </GNBWrapper>
  );
}

export default GNB;
