import { useRouteMatch } from 'react-router-dom';

import { LocationParams } from '_models/Location';
import { Room, RoomType } from '_models/Room';

import { useLoadData } from '_utils/useLoadData';
import { MyTabContext } from '_components/MyTabContext';

type RoomTabContextProps = {
  tabPanelContent: React.ReactElement;
  selected?: string;
  type?: RoomType;
};

export function RoomTabContext(props: RoomTabContextProps) {
  const { tabPanelContent, type, selected } = props;

  const match = useRouteMatch<LocationParams>();

  const typeQuery = !!type ? `&type=${type}` : '';

  // カテゴリ取得
  const [{ data }] = useLoadData<Room[]>(`/room/choices?location=${match.params.location}${typeQuery}`, []);

  return <MyTabContext data={data} tabPanelContent={tabPanelContent} selected={selected} />;
}
