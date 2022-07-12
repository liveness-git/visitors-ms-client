import { MuiPickersContext } from '@material-ui/pickers';
import { format } from 'date-fns';
import { useCallback, useContext, useMemo, useState } from 'react';
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
};

export function DataTable(props: DataTableProps) {
  const { currentDate, dataDialogHook, tabKey } = props;

  const { t } = useTranslation();
  const match = useRouteMatch<LocationParams>();
  const muiPickContext = useContext(MuiPickersContext); // locale取得用

  // データ取得
  const [{ data, isLoading, isError }, reload] = useLoadData<TimeBarDataType>(
    `/event/byroom/weekly?timestamp=${currentDate!.getTime()}&location=${match.params.location}&room=${tabKey}`,
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
        {data.schedules.map((schedule) => (
          <TimeBar
            dataDialogHook={dataDialogHook}
            schedule={schedule}
            events={data!.events.filter((_event, eIdx) => schedule.eventsIndex.some((num: number) => num === eIdx))}
            onClickCallback={handleDialogOpen}
            keyLabel={format(schedule.date, 'yyyy/MM/dd', { locale: muiPickContext?.locale })}
            keyValue={schedule.date.toString()}
          ></TimeBar>
        ))}
      </>
    );
  }, [data, dataDialogHook, handleDialogOpen, muiPickContext?.locale]);

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
