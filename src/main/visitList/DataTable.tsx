import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import MaterialTable, { Column } from '@material-table/core';

import { tableIcons } from '_utils/MaterialTableIcons';
import { useLoadData } from '_utils/useLoadData';

import { RoomType } from '_models/Room';

import { DataDialogAction, DataDialogState, DataTableBase, RowDataType, tableTheme } from '../DataTableBase';

export type Columns = {
  title: string;
  field: string;
  hidden?: boolean; // テーブルに表示するか否か
};

type DataTableProps = {
  currentTab: RoomType;
  currentDate: Date;
  dataDialogHook: {
    state: DataDialogState;
    dispatch: React.Dispatch<DataDialogAction>;
  };
};

export function DataTable(props: DataTableProps) {
  const { currentDate, dataDialogHook, currentTab } = props;

  const { t } = useTranslation();

  // データ取得
  const [{ data, isLoading, isError }, reload] = useLoadData<RowDataType[]>(
    `/event/visitlist?timestamp=${currentDate!.getTime()}&type=${currentTab}`,
    []
  );

  // 選択行の状態
  const [currentRow, setCurrentRow] = useState<RowDataType | null>(null);

  // ダイアログを開く
  const handleDialogOpen = (selectedRow: RowDataType) => {
    if (selectedRow.isAuthor) {
      dataDialogHook.dispatch({ type: 'inputOpen' });
    } else {
      dataDialogHook.dispatch({ type: 'readOpen' });
    }
    setCurrentRow(selectedRow);
  };

  const columns: Columns[] = [
    { title: t('visittable.header.appt-time'), field: 'apptTime' },
    { title: t('visittable.header.room-name'), field: 'roomName' },
    { title: t('visittable.header.visit-company'), field: 'visitCompany' },
    { title: t('visittable.header.visitor-name'), field: 'visitorName', hidden: true },
    { title: t('visittable.header.tea-supply'), field: 'teaSupply', hidden: true },
    { title: t('visittable.header.number-of-visitor'), field: 'numberOfVisitor', hidden: true },
    { title: t('visittable.header.number-of-employee'), field: 'numberOfEmployee', hidden: true },
    { title: t('visittable.header.comment'), field: 'comment', hidden: true },
    { title: t('visittable.header.reservation-name'), field: 'reservationName' },
    { title: t('visittable.header.contact-addr'), field: 'contactAddr' },
  ];

  // データ取得失敗した場合
  if (isError) {
    return <div>{t('common.msg.fetch-failed')}</div>;
  }

  return (
    <DataTableBase currentTab={currentTab} currentRow={currentRow} dataDialogHook={dataDialogHook} isLoading={isLoading} reload={reload}>
      <MaterialTable
        columns={columns as Column<RowDataType>[]}
        data={data!}
        onRowClick={(_event, selectedRow?) => !!selectedRow && handleDialogOpen(selectedRow)}
        options={{
          showTitle: false,
          toolbar: false,
          search: false,
          headerStyle: { backgroundColor: tableTheme.palette.primary.light },
        }}
        icons={tableIcons}
      />
    </DataTableBase>
  );
}
