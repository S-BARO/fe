import { css } from "@emotion/react";
import { motion } from "framer-motion";
import { useTabFilter } from "../../libs/useTabFilter";

/**
 * TabMenu 컴포넌트는 탭 네비게이션 UI를 보여주고 URL 쿼리 파라미터와 동기화합니다.
 */
const wrapperStyle = css`
  border-bottom: 1px solid #eee;
  padding: 12px 0;
`;

const tabListStyle = css`
  display: flex;
  justify-content: space-around;
  position: relative;
`;

const tabStyle = (isActive: boolean) => css`
  position: relative;
  padding: 8px 0;
  font-weight: ${isActive ? "bold" : "normal"};
  color: ${isActive ? "#000" : "#888"};
  cursor: pointer;
`;

const underlineStyle = css`
  position: absolute;
  bottom: -1px;
  left: 0;
  right: 0;
  height: 2px;
  background-color: black;
  border-radius: 2px;
`;

/**
 * TabMenu에서 사용할 탭 이름 목록입니다.
 */
const tabs = ["전체보기", "신상품", "이벤트", "장바구니"];

export default function HomeFilter() {
  const [activeTab, handleTabClick] = useTabFilter(tabs, "tab");

  return (
    <div css={wrapperStyle}>
      <div css={tabListStyle}>
        {tabs.map((tab) => (
          <div
            key={tab}
            onClick={() => handleTabClick(tab)}
            css={tabStyle(tab === activeTab)}
          >
            {tab}
            {tab === activeTab && (
              <motion.div
                layoutId="underline"
                css={underlineStyle}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
