import { useRouteMatch } from 'react-router-dom';

import { LocationParams } from '_models/Location';
import { Room, RoomType } from '_models/Room';

import { useLoadData } from '_utils/useLoadData';
import { MyTabContext } from '_components/MyTabContext';

type RoomTabContextProps = {
  tabPanelContent: React.ReactElement;
  selected?: string;
};

export function RoomTabContext(props: RoomTabContextProps) {
  const { tabPanelContent, selected } = props;

  const match = useRouteMatch<LocationParams>();

  // カテゴリ取得
  const [{ data }] = useLoadData<Room[]>(`/room/choices?location=${match.params.location}&samecategory=${selected}`, []);

  return <>{!!data?.length && <MyTabContext data={data} tabPanelContent={tabPanelContent} selected={selected} />}</>;
}
