import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useLoadData } from '_utils/useLoadData';

import { DataDialogAction, DataDialogState, DataTableBase, RowDataType } from '../DataTableBase';

export type Columns = {
  title: string;
  field: string;
  hidden?: boolean; // テーブルに表示するか否か
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

  // データ取得
  const [{ data, isLoading, isError }, reload] = useLoadData<RowDataType[]>(`/event/visitlist?timestamp=${currentDate!.getTime()}`, []);

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

  // データ取得失敗した場合
  if (isError) {
    return <div>{t('common.msg.fetch-failed')}</div>;
  }

  return (
    <DataTableBase currentRow={currentRow} dataDialogHook={dataDialogHook} isLoading={isLoading} reload={reload}>
      <>test</>
    </DataTableBase>
  );
}
