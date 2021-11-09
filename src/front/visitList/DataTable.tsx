import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import { grey, purple } from '@material-ui/core/colors';

import MaterialTable, { Column } from '@material-table/core';
import { tableIcons } from '_components/utils/MaterialTableIcons';

import { VisitorInfoMs, VisitorInfoPersonal, VisitorInfoFront } from '_components/VisitorInfo';
import { useLoadData } from '_components/utils/useLoadData';
import { Spinner } from '_components/utils/Spinner';

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
  hidden?: boolean;
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
  const [{ data, isLoading }, reload] = useLoadData<RowData[]>(url, []);

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
  const handleDialogClose = () => {
    if (isSubmited) {
      reload();
      setSubmited(false);
    }
    setDialogOpen(false);
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
    { title: t('visittable.header.check-in'), field: 'checkIn', type: 'boolean' },
    { title: t('visittable.header.check-out'), field: 'checkOut', type: 'boolean' },
    { title: t('visittable.header.visitor-card-number'), field: 'visitorCardNumber', hidden: true },
  ];

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
