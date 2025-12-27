"use client";

import { useRouter } from "next/navigation";
import HomeFilter from "../Filter/HomeFilter";
import {
  HeaderBar,
  HeaderLogo,
  HeaderSearchIcon,
  HeaderFilterWrapper,
} from "./styles";

interface HeaderProps {
  showFilter?: boolean;
  filterComponent?: React.ReactNode;
}

function Header({ showFilter = true, filterComponent }: HeaderProps) {
  const router = useRouter();
  return (
    <div>
      <HeaderBar>
        <div onClick={() => router.push("/")} className="">
          <HeaderLogo src="/logo.png" alt="로고" />
        </div>
        <HeaderSearchIcon src="/search.png" alt="검색" />
      </HeaderBar>
      <HeaderFilterWrapper>
        {showFilter ? filterComponent ?? <HomeFilter /> : null}
      </HeaderFilterWrapper>
    </div>
  );
}

export default Header;
