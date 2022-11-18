import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import MaterialTable, { Column } from '@material-table/core';

import { tableIcons, pageingOntions } from '_utils/MaterialTableIcons';
import { useLoadData } from '_utils/useLoadData';

import { tableTheme } from '_styles/TableTheme';

import { DataDialogAction, DataDialogState, DataTableBase } from './DataTableBase';
import { InputFields } from './RowDataInputDialog';

export type Columns<RowData> = {
  title: string;
  field: string;
  type?: string;
  sorting?: boolean;
  cellStyle?: object | void;
  render?: (rowData: RowData) => any;
};

type DataTableProps<RowData> = {
  inputFields: InputFields<RowData>;
  columns: Columns<RowData>[];
  dataDialogHook: {
    state: DataDialogState;
    dispatch: React.Dispatch<DataDialogAction>;
  };
};

export function DataTable<RowData extends object>(props: DataTableProps<RowData>) {
  const { inputFields, columns, dataDialogHook } = props;

  const { t } = useTranslation();

  // データ取得
  const [{ data, isLoading, isError }, reload, setUrl] = useLoadData<RowData[]>('', []);
  useEffect(() => {
    setUrl(`/${inputFields.type}/list`);
  }, [inputFields.type, setUrl]);

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
    <DataTableBase<RowData> inputFields={inputFields} currentRow={currentRow} dataDialogHook={dataDialogHook} isLoading={isLoading} reload={reload}>
      <MaterialTable
        columns={columns as Column<RowData>[]}
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
