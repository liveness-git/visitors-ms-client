import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useRouteMatch } from 'react-router-dom';

import { LocationParams } from '_models/Location';
import { Schedule } from '_models/Schedule';

import { useLoadData } from '_utils/useLoadData';

import { DataDialogAction, DataDialogState, DataTableBase, RowDataType } from '../DataTableBase';
import { TimeBar } from '../TimeBar';

type TimeBarDataType = {
  events: RowDataType[];
  schedules: Schedule[];
};

type DataTableProps = {
  currentDate: Date;
  dataDialogHook: {
    state: DataDialogState;
    dispatch: React.Dispatch<DataDialogAction>;
  };
  tabKey: string;
  onTitleClick: (timestamp: number, categoryId: string, roomId: string) => void;
};

export function DataTable(props: DataTableProps) {
  const { currentDate, dataDialogHook, tabKey, onTitleClick } = props;

  const { t } = useTranslation();
  const match = useRouteMatch<LocationParams>();

  // データ取得
  const [{ data, isLoading, isError }, reload] = useLoadData<TimeBarDataType>(
    `/event/byroom?timestamp=${currentDate!.getTime()}&location=${match.params.location}&category=${tabKey}`,
    undefined
  );

  // 選択行の状態
  const [currentRow, setCurrentRow] = useState<RowDataType | null>(null);

  // ダイアログを開く
  const handleDialogOpen = useCallback(
    (selectedRow: RowDataType) => {
      if (selectedRow.isAuthor) {
        dataDialogHook.dispatch({ type: 'inputOpen' });
      } else {
        dataDialogHook.dispatch({ type: 'readOpen' });
      }
      setCurrentRow(selectedRow);
    },
    [dataDialogHook]
  );

  // タイムバーの表示（不要レンダリングが起きるためメモ化）
  const timeBars = useMemo(() => {
    if (!data) return <></>;
    return (
      <>
        {data.schedules.map((schedule, sIdx) => (
          <TimeBar
            key={sIdx}
            dataDialogHook={dataDialogHook}
            schedule={schedule}
            events={schedule.eventsIndex.map((row) => row.map((eventIndex) => data!.events[eventIndex]))}
            onClickCallback={handleDialogOpen}
            keyLabel={schedule.roomName}
            keyValue={schedule.roomEmail}
            onTitleClick={onTitleClick}
          ></TimeBar>
        ))}
      </>
    );
  }, [data, dataDialogHook, handleDialogOpen, onTitleClick]);

  // データ取得失敗した場合
  if (isError) {
    return <div>{t('common.msg.fetch-failed')}</div>;
  }

  return (
    <DataTableBase currentRow={currentRow} dataDialogHook={dataDialogHook} isLoading={isLoading} reload={reload}>
      {timeBars}
    </DataTableBase>
  );
}
