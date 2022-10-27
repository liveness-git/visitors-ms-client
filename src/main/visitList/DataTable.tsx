import { useEffect } from 'react';
import { useRouteMatch } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import MaterialTable, { MTableCell } from '@material-table/core';

import { tableIcons, pageingOntions } from '_utils/MaterialTableIcons';
import { useLoadData } from '_utils/useLoadData';
import { UseDataTable } from '_utils/UseDataTable';

import { LocationParams } from '_models/Location';
import { cellStyle, makeVisitorTableStyles } from '_styles/VisitorTableStyle';
import { tableTheme } from '_styles/TableTheme';

import { DataDialogAction, DataDialogState, DataTableBase, RowDataType } from '../DataTableBase';

const useStyles = makeVisitorTableStyles(false);

export type Columns = {
  title: string;
  field: string;
};

type DataTableProps = {
  currentDate: Date;
  dataDialogHook: {
    state: DataDialogState;
    dispatch: React.Dispatch<DataDialogAction>;
  };
};

export function DataTable(props: DataTableProps) {
  const { currentDate, dataDialogHook } = props;

  const { t } = useTranslation();
  const classes = useStyles();
  const match = useRouteMatch<LocationParams>();

  // データ取得
  const [{ data, isLoading, isError }, reload, setUrl] = useLoadData<RowDataType[]>('', []);
  useEffect(() => {
    setUrl(`/event/visitlist?timestamp=${currentDate!.getTime()}&location=${match.params.location}`);
  }, [currentDate, match.params.location, setUrl]);

  // 選択行の状態
  const [{ currentRow }, , handleDialogOpen, handleRecConfClose] = UseDataTable({ dataDialogHook: dataDialogHook });

  const columns: Columns[] = [
    { title: t('visittable.header.appt-time'), field: 'apptTime' },
    { title: t('visittable.header.room-name'), field: 'roomName' },
    { title: t('visittable.header.event-subject'), field: 'subject' },
    { title: t('visittable.header.visit-company'), field: 'visitCompany' },
    { title: t('visittable.header.reservation-name'), field: 'reservationName' },
  ];

  // データ取得失敗した場合
  if (isError) {
    return <div>{t('common.msg.fetch-failed')}</div>;
  }

  return (
    <DataTableBase currentRow={currentRow} dataDialogHook={dataDialogHook} isLoading={isLoading} reload={reload} onRecConfClose={handleRecConfClose}>
      <MaterialTable
        columns={columns}
        components={{
          // Row: (props) => <MTableBodyRow {...props} className={rowStyle(props.data)} />,
          Cell: (props) => <MTableCell {...props} className={cellStyle(props.columnDef.field, props.rowData, classes)} />,
        }}
        data={data!}
        onRowClick={(_event, selectedRow?) => !!selectedRow && handleDialogOpen(selectedRow)}
        options={{
          showTitle: false,
          toolbar: false,
          search: false,
          headerStyle: { backgroundColor: tableTheme.palette.primary.light },
          tableLayout: 'fixed',
          ...pageingOntions,
        }}
        icons={tableIcons}
      />
    </DataTableBase>
  );
}
