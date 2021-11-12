import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import { grey, purple } from '@material-ui/core/colors';

import MaterialTable, { Column } from '@material-table/core';
import { tableIcons } from '_utils/MaterialTableIcons';

import { VisitorInfoMs, VisitorInfoPersonal, VisitorInfoFront } from '_models/VisitorInfo';
import { useLoadData } from '_utils/useLoadData';
import { Spinner } from '_components/Spinner';

import { RowDataDialog } from './RowDataDialog';

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
});

export type Columns = {
  title: string;
  field: string;
  type?: string;
  hidden?: boolean; // テーブルに表示するか否か
  sort: number; // ダイアログの表に表示する順番
};

export type RowData = VisitorInfoMs & VisitorInfoPersonal & VisitorInfoFront;

type DataTableProps = {
  currentDate: Date;
  url: string;
};

export function DataTable(props: DataTableProps) {
  const { currentDate, url } = props;

  const { t } = useTranslation();

  // データ取得
  const [{ data, isLoading, isError }, reload] = useLoadData<RowData[]>(url, []);

  // ダイアログの状態
  const [dialogOpen, setDialogOpen] = useState(false);
  // submitの状態
  const [isSubmited, setSubmited] = useState(false);
  // 選択行の状態
  const [currentRow, setCurrentRow] = useState<RowData | null>(null);

  // ダイアログを開く
  const handleDialogOpen = (selectedRow: RowData) => {
    setDialogOpen(true);
    setCurrentRow(selectedRow);
  };
  // ダイアログを閉じる
  const handleDialogClose = async () => {
    if (isSubmited) {
      await reload();
      setSubmited(false);
    }
    setDialogOpen(false);
  };

  const columns: Columns[] = [
    { title: t('visittable.header.appt-time'), field: 'apptTime', sort: 1 },
    { title: t('visittable.header.room-name'), field: 'roomName', sort: 4 },
    { title: t('visittable.header.visit-company'), field: 'visitCompany', sort: 5 },
    { title: t('visittable.header.visitor-name'), field: 'visitorName', hidden: true, sort: 6 },
    { title: t('visittable.header.tea-supply'), field: 'teaSupply', hidden: true, sort: 7 },
    { title: t('visittable.header.number-of-visitor'), field: 'numberOfVisitor', hidden: true, sort: 8 },
    { title: t('visittable.header.number-of-employee'), field: 'numberOfEmployee', hidden: true, sort: 9 },
    { title: t('visittable.header.comment'), field: 'comment', hidden: true, sort: 10 },
    { title: t('visittable.header.reservation-name'), field: 'reservationName', sort: 11 },
    { title: t('visittable.header.contact-addr'), field: 'contactAddr', sort: 12 },
    { title: t('visittable.header.check-in'), field: 'checkIn', type: 'boolean', sort: 2 },
    { title: t('visittable.header.check-out'), field: 'checkOut', type: 'boolean', sort: 3 },
    { title: t('visittable.header.visitor-card-number'), field: 'visitorCardNumber', hidden: true, sort: 13 },
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
      {currentRow && (
        <RowDataDialog
          open={dialogOpen}
          onClose={handleDialogClose}
          currentDate={currentDate}
          data={currentRow}
          columns={columns}
          setSubmited={setSubmited}
        />
      )}
    </ThemeProvider>
  );
}
