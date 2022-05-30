import { useCallback, useState } from 'react';
import { useRouteMatch } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import i18next from 'i18next';
import clsx from 'clsx';

import { createStyles, makeStyles, Theme } from '@material-ui/core';
import MaterialTable, { Column, MTableCell } from '@material-table/core';
import { ClassNameMap } from '@material-ui/core/styles/withStyles';

import BorderColorIcon from '@material-ui/icons/BorderColor';

import { tableIcons } from '_utils/MaterialTableIcons';
import { useLoadData } from '_utils/useLoadData';

import { DataDialogAction, DataDialogState, DataTableBase, RowDataType, tableTheme } from '../DataTableBase';
import { RowDataFrontDialog } from './RowDataFrontDialog';

import { LocationParams } from '_models/Location';
import { VisitorInfoFront } from '_models/VisitorInfo';

const useStyles = makeStyles<Theme>(() => {
  return createStyles({
    //cell default
    cellApptTime: {},
    cellRoomName: {},
    cellRoomStatus: {},
    cellReservationName: {},
    cellVisitCompany: {},
    cellSubject: {},
    // 会議室状態が辞退の場合
    declinedApptTime: { textDecoration: 'line-through 2px solid red' },
    declinedRoomName: {
      '&::after': {
        wordBreak: 'keep-all',
        marginLeft: 5,
        padding: '1px 5px',
        color: 'red',
        border: '1px solid red',
        content: `"${i18next.t('visitdialog.view.resource-status-declined')}"`,
      },
    },
  });
});

export type Columns = {
  title: string;
  field: string;
  type?: string;
};

export type FrontRowData = RowDataType & VisitorInfoFront;

type DataTableProps = {
  currentDate: Date;
  dataDialogHook: {
    state: DataDialogState;
    dispatch: React.Dispatch<DataDialogAction>;
  };
  category: string;
};

export function DataTable(props: DataTableProps) {
  const { currentDate, dataDialogHook, category } = props;

  const { t } = useTranslation();
  const classes = useStyles();
  const match = useRouteMatch<LocationParams>();

  // データ取得
  const [{ data, isLoading, isError }, reload] = useLoadData<FrontRowData[]>(
    `/front/visitlist?timestamp=${currentDate!.getTime()}&location=${match.params.location}&category=${category}`,
    []
  );

  // フロント用ダイアログの状態
  const [frontDialogOpen, setFrontDialogOpen] = useState(false);

  // 選択行の状態
  const [currentRow, setCurrentRow] = useState<FrontRowData | null>(null);

  // ダイアログを開く
  const handleDialogOpen = useCallback(
    (selectedRow: FrontRowData) => {
      if (selectedRow.isAuthor) {
        dataDialogHook.dispatch({ type: 'inputOpen' });
      } else {
        dataDialogHook.dispatch({ type: 'readOpen' });
      }
      setCurrentRow(selectedRow);
    },
    [dataDialogHook]
  );

  // フロント用ダイアログを開く
  const handleFrontDialogOpen = useCallback((selectedRow: FrontRowData) => {
    setFrontDialogOpen(true);
    setCurrentRow(selectedRow);
  }, []);
  // フロント用ダイアログを閉じる
  const handleFrontDialogClose = async () => {
    setFrontDialogOpen(false);
  };

  const columns: Columns[] = [
    { title: t('visittable.header.appt-time'), field: 'apptTime' },
    { title: t('visittable.header.room-name'), field: 'roomName' },
    { title: t('visittable.header.visit-company'), field: 'visitCompany' },
    { title: t('visittable.header.reservation-name'), field: 'reservationName' },
    { title: t('visittable.header.contact-addr'), field: 'contactAddr' },
    { title: t('visittable.header.check-in'), field: 'checkIn', type: 'boolean' },
    { title: t('visittable.header.check-out'), field: 'checkOut', type: 'boolean' },
  ];

  const cellStyle = (field: String, rowData: FrontRowData) => {
    const className = field.charAt(0).toUpperCase() + field.slice(1);
    return clsx(
      classes[`cell${className}` as keyof ClassNameMap],
      rowData.roomStatus === 'declined' && classes[`declined${className}` as keyof ClassNameMap]
    );
  };

  // データ取得失敗した場合
  if (isError) {
    return <div>{t('common.msg.fetch-failed')}</div>;
  }

  return (
    <DataTableBase currentRow={currentRow} dataDialogHook={dataDialogHook} isLoading={isLoading} reload={reload}>
      <MaterialTable
        columns={columns as Column<FrontRowData>[]}
        components={{
          Cell: (props) => <MTableCell {...props} className={cellStyle(props.columnDef.field, props.rowData)} />,
        }}
        data={data!}
        onRowClick={(_event, selectedRow?) => !!selectedRow && handleFrontDialogOpen(selectedRow)}
        actions={[
          {
            icon: () => <BorderColorIcon />,
            tooltip: t('visittable.header.edit-action'),
            onClick: (_, rowData) => !!rowData && handleDialogOpen(rowData as FrontRowData),
          },
        ]}
        localization={{
          header: { actions: '' },
        }}
        options={{
          showTitle: false,
          toolbar: false,
          search: false,
          headerStyle: { backgroundColor: tableTheme.palette.primary.light },
          tableLayout: 'fixed',
          // actionsColumnIndex: -1,
        }}
        icons={tableIcons}
      />
      {currentRow && <RowDataFrontDialog open={frontDialogOpen} onClose={handleFrontDialogClose} data={currentRow} reload={reload} />}
    </DataTableBase>
  );
}
