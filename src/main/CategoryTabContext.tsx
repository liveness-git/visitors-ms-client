import { Category } from '_models/Category';
import { useLoadData } from '_utils/useLoadData';
import { MyTabContext } from '_components/MyTabContext';

type CategoryTabContextProps = {
  tabPanelContent: React.ReactElement;
};

export function CategoryTabContext(props: CategoryTabContextProps) {
  const { tabPanelContent } = props;

  // カテゴリ取得
  const [{ data }] = useLoadData<Category[]>(`/category/choices`, []);

  return <MyTabContext data={data} tabPanelContent={tabPanelContent} />;
}
