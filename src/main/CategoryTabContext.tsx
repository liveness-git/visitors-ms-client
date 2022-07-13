import { Category } from '_models/Category';
import { useLoadData } from '_utils/useLoadData';
import { MyTabContext } from '_components/MyTabContext';

type CategoryTabContextProps = {
  tabPanelContent: React.ReactElement;
  selected?: string;
};

export function CategoryTabContext(props: CategoryTabContextProps) {
  const { tabPanelContent, selected } = props;

  // カテゴリ取得
  const [{ data }] = useLoadData<Category[]>(`/category/choices`, []);

  return <>{!!data?.length && <MyTabContext data={data} tabPanelContent={tabPanelContent} selected={selected} />}</>;
}
