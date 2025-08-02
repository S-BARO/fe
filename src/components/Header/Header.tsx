import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
  return (
    <div>
      <HeaderBar>
        <div onClick={() => navigate("/")} className="">
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
