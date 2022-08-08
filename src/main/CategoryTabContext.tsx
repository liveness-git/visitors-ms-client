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
  const [{ data }] = useLoadData<Category[]>(`/category/choices?location=${match.params.location}`, []);

  return <>{!!data?.length && <MyTabContext data={data} tabPanelContent={tabPanelContent} selected={selected} />}</>;
}
