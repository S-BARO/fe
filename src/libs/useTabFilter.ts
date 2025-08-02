import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";

/**
 * URL 쿼리 파라미터를 이용한 탭 필터링 커스텀 훅입니다.
 *
 * @param tabs - 사용할 탭 이름 목록입니다.
 * @param paramKey - 쿼리 파라미터 키(기본값: 'tab')입니다.
 * @returns [activeTab, handleTabClick]
 */
export function useTabFilter(tabs: string[], paramKey: string = "tab") {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get(paramKey);

  const activeTab = useMemo(() => {
    return tabParam && tabs.includes(tabParam) ? tabParam : tabs[0];
  }, [tabParam, tabs]);

  const handleTabClick = (tab: string) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set(paramKey, tab);
    setSearchParams(newParams);
  };

  return [activeTab, handleTabClick] as const;
}
