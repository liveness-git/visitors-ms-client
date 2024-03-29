import { useEffect } from 'react';
import { useRouteMatch } from 'react-router-dom';

import { LocationParams } from '_models/Location';
import { Room } from '_models/Room';

import { useLoadData } from '_utils/useLoadData';
import { MyTabContext } from '_components/MyTabContext';
import { Spinner } from '_components/Spinner';

type RoomTabContextProps = {
  tabPanelContent: React.ReactElement;
  selected?: string;
};

export function RoomTabContext(props: RoomTabContextProps) {
  const { tabPanelContent, selected } = props;

  const match = useRouteMatch<LocationParams>();

  // カテゴリ取得
  const [{ data, isLoading }, , setUrl] = useLoadData<Room[]>('', []);
  useEffect(() => {
    setUrl(`/room/choices?location=${match.params.location}&samecategory=${selected}`);
  }, [match.params.location, selected, setUrl]);

  return (
    <>
      <Spinner open={isLoading} />
      {!!data?.length && <MyTabContext data={data} tabPanelContent={tabPanelContent} selected={selected} />}
    </>
  );
}
