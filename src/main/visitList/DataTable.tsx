import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import { grey, purple } from '@material-ui/core/colors';

import MaterialTable, { Column } from '@material-table/core';
import { tableIcons } from '_utils/MaterialTableIcons';

import { VisitorInfoMs, VisitorInfoPersonal } from '_models/VisitorInfo';
import { useLoadData } from '_utils/useLoadData';
import { Spinner } from '_components/Spinner';

import { RowDataDialog } from './RowDataDialog';
import { RoomType } from '_models/Room';

const tableTheme = createTheme({
  palette: {
    primary: {
      main: grey[300],
    },
    secondary: {
      main: purple[500],
    },
  },
  props: {
    MuiTableRow: {
      // hover: true,
      // selected: true,
    },
  },
  overrides: {
    MuiTable: {
      root: {
        borderCollapse: 'separate',
      },
    },
  },
});

export type Columns = {
  title: string;
  field: string;
  hidden?: boolean; // テーブルに表示するか否か
};

export type RowData = VisitorInfoMs & VisitorInfoPersonal;

export type DataDialogState = {
  mode: 'rowData' | 'addData';
  open: boolean;
};

export type DataDialogAction = {
  type: 'rowDataOpen' | 'addDataOpen' | 'close';
};

export const dataDialogReducer = (state: DataDialogState, action: DataDialogAction): DataDialogState => {
  switch (action.type) {
    case 'rowDataOpen':
      return { mode: 'rowData', open: true };
    case 'addDataOpen':
      return { mode: 'addData', open: true };
    case 'close':
      return { ...state, open: false };
    default:
      return state;
  }
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
  const [{ data, isLoading, isError }, reload] = useLoadData<RowData[]>(
    `/event/visitlist?timestamp=${currentDate!.getTime()}&type=${currentTab}`,
    []
  );

  // 選択行の状態
  const [currentRow, setCurrentRow] = useState<RowData | null>(null);

  // ダイアログを開く
  const handleDialogOpen = (selectedRow: RowData) => {
    dataDialogHook.dispatch({ type: 'rowDataOpen' });
    setCurrentRow(selectedRow);
  };
  // ダイアログを閉じる
  const handleDialogClose = async () => {
    dataDialogHook.dispatch({ type: 'close' });
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
    <ThemeProvider theme={tableTheme}>
      <Spinner open={isLoading} />
      <MaterialTable
        columns={columns as Column<RowData>[]}
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
      <RowDataDialog
        currentTab={currentTab}
        open={dataDialogHook.state.open}
        onClose={handleDialogClose}
        data={dataDialogHook.state.mode === 'addData' ? null : currentRow}
        reload={reload}
      />
    </ThemeProvider>
  );
}
