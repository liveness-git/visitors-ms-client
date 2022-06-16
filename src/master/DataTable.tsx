import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';

import MaterialTable, { Column, MTableCell } from '@material-table/core';

import { tableIcons } from '_utils/MaterialTableIcons';
import { useLoadData } from '_utils/useLoadData';

import { cellStyle, makeVisitorTableStyles } from '_styles/VisitorTableStyle';
import { tableTheme } from '_styles/TableTheme';

import { DataDialogAction, DataDialogState, DataTableBase } from './DataTableBase';
import { DefaultValuesType, Mastertype } from './RowDataInputDialog';

const useStyles = makeVisitorTableStyles();

export type Columns = {
  title: string;
  field: string;
  type?: string;
  cellStyle?: object | void;
};

type DataTableProps<RowData> = {
  master: Mastertype;
  columns: Columns[];
  defaultValues: DefaultValuesType<RowData>;
  dataDialogHook: {
    state: DataDialogState;
    dispatch: React.Dispatch<DataDialogAction>;
  };
};

export function DataTable<RowData extends object>(props: DataTableProps<RowData>) {
  const { master, columns, defaultValues, dataDialogHook } = props;

  const { t } = useTranslation();
  const classes = useStyles();

  // データ取得
  const [{ data, isLoading, isError }, reload] = useLoadData<RowData[]>(`/${master}/list`, []);

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
    <DataTableBase<RowData>
      master={master}
      defaultValues={defaultValues}
      currentRow={currentRow}
      dataDialogHook={dataDialogHook}
      isLoading={isLoading}
      reload={reload}
    >
      <MaterialTable
        columns={columns as Column<RowData>[]}
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
