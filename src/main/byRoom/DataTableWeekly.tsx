import { MuiPickersContext } from '@material-ui/pickers';
import { format } from 'date-fns';
import { useContext, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useRouteMatch } from 'react-router-dom';

import { LocationParams } from '_models/Location';
import { Schedule } from '_models/Schedule';
import { LroomsType } from '_models/Lrooms';

import { useLoadData } from '_utils/useLoadData';
import { UseDataTable } from '_utils/UseDataTable';

import { DataDialogAction, DataDialogState, DataTableBase, RowDataType } from '../DataTableBase';
import { BoxStyleType, TimeBar } from '../TimeBar';
import { TimeBarRangeToggle } from 'main/TimeBarRangeToggle';

type TimeBarDataType = {
  events: RowDataType[];
  schedules: Schedule[];
  lrooms: LroomsType[];
};

type DataTableProps = {
  currentDate: Date;
  dataDialogHook: {
    state: DataDialogState;
    dispatch: React.Dispatch<DataDialogAction>;
  };
  tabKey: string;
  rangeToggle: BoxStyleType;
  onChangeRangeToggle: (value: BoxStyleType) => void;
  onTitleClick: (timestamp: number, categoryId: string, roomId: string) => void;
};

export function DataTableWeekly(props: DataTableProps) {
  const { currentDate, dataDialogHook, tabKey, rangeToggle, onChangeRangeToggle, onTitleClick } = props;

  const { t } = useTranslation();
  const match = useRouteMatch<LocationParams>();
  const muiPickContext = useContext(MuiPickersContext); // locale取得用

  // データ取得
  const [{ data, isLoading, isError }, reload, setUrl] = useLoadData<TimeBarDataType>('', undefined);
  useEffect(() => {
    setUrl(`/event/byroom/weekly?timestamp=${currentDate!.getTime()}&location=${match.params.location}&room=${tabKey}`);
  }, [currentDate, match.params.location, setUrl, tabKey]);

  // 選択行の状態
  const [{ currentRow }, , handleDialogOpen, handleRecConfClose] = UseDataTable({ dataDialogHook: dataDialogHook });

  // タイムバーの表示（不要レンダリングが起きるためメモ化）
  const timeBars = useMemo(() => {
    if (!data) return <></>;
    return (
      <>
        {data.schedules.map((schedule, sIdx) => (
          <TimeBar
            key={sIdx}
            rangeToggle={rangeToggle}
            dataDialogHook={dataDialogHook}
            schedule={schedule}
            events={schedule.eventsIndex.map((row) => row.map((eventIndex) => data!.events[eventIndex]))}
            lrooms={schedule.lroomsIndex.map((row) => row.map((lroomsIndex) => data!.lrooms[lroomsIndex]))}
            onClickCallback={handleDialogOpen}
            keyLabel={format(schedule.date, 'yyyy/MM/dd (E)', { locale: muiPickContext?.locale })}
            keyValue={schedule.date.toString()}
            onTitleClick={onTitleClick}
          ></TimeBar>
        ))}
      </>
    );
  }, [data, dataDialogHook, handleDialogOpen, muiPickContext?.locale, onTitleClick, rangeToggle]);

  // データ取得失敗した場合
  if (isError) {
    return <div>{t('common.msg.fetch-failed')}</div>;
  }

  return (
    <DataTableBase currentRow={currentRow} dataDialogHook={dataDialogHook} isLoading={isLoading} reload={reload} onRecConfClose={handleRecConfClose}>
      <TimeBarRangeToggle rangeToggle={rangeToggle} onChangeRangeToggle={onChangeRangeToggle} />
      {timeBars}
    </DataTableBase>
  );
}
