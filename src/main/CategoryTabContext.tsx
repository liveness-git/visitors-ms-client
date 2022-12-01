import { useEffect } from 'react';
import { useRouteMatch } from 'react-router-dom';
import { LocationParams } from '_models/Location';
import { Category } from '_models/Category';
import { useLoadData } from '_utils/useLoadData';
import { MyTabContext } from '_components/MyTabContext';

type CategoryTabContextProps = {
  tabPanelContent: React.ReactElement;
  selected?: string;
};

export function CategoryTabContext(props: CategoryTabContextProps) {
  const { tabPanelContent, selected } = props;

  const match = useRouteMatch<LocationParams>();

  // カテゴリ取得
  const [{ data }, , setUrl] = useLoadData<Category[]>('', []);
  useEffect(() => {
    setUrl(`/category/choices?location=${match.params.location}&tab=byroom`);
  }, [match.params.location, setUrl]);

  return <>{!!data?.length && <MyTabContext data={data} tabPanelContent={tabPanelContent} selected={selected} />}</>;
}
