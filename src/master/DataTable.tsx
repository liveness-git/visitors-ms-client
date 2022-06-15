import { useCallback, useState } from 'react';
import { useRouteMatch } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import MaterialTable, { MTableCell } from '@material-table/core';

import { tableIcons } from '_utils/MaterialTableIcons';
import { useLoadData } from '_utils/useLoadData';

import { LocationParams } from '_models/Location';
import { cellStyle, makeVisitorTableStyles } from '_styles/VisitorTableStyle';
import { tableTheme } from '_styles/TableTheme';

import { DataDialogAction, DataDialogState, DataTableBase } from './DataTableBase';

const useStyles = makeVisitorTableStyles();

export type Columns = {
  title: string;
  field: string;
};

type DataTableProps = {
  columns: Columns[];
  dataDialogHook: {
    state: DataDialogState;
    dispatch: React.Dispatch<DataDialogAction>;
  };
};

export function DataTable<RowData extends object>(props: DataTableProps) {
  const { columns, dataDialogHook } = props;

  const { t } = useTranslation();
  const classes = useStyles();
  const match = useRouteMatch<LocationParams>();

  // データ取得
  const [{ data, isLoading, isError }, reload] = useLoadData<RowData[]>(
    `/event/visitlist?timestamp=${new Date('2022-06-01').getTime()}&location=${match.params.location}`,
    []
  );

  // 選択行の状態
  const [currentRow, setCurrentRow] = useState<RowData | null>(null);

  // ダイアログを開く
  const handleDialogOpen = useCallback(
    (selectedRow: RowData) => {
      dataDialogHook.dispatch({ type: 'inputOpen' });
      setCurrentRow(selectedRow);
    },
    [dataDialogHook]
  );

  // データ取得失敗した場合
  if (isError) {
    return <div>{t('common.msg.fetch-failed')}</div>;
  }

  return (
    <DataTableBase currentRow={currentRow} dataDialogHook={dataDialogHook} isLoading={isLoading} reload={reload}>
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
        }}
        icons={tableIcons}
      />
    </DataTableBase>
  );
}
