import { useCallback, useState } from 'react';

import { DataDialogAction, DataDialogState, RowDataType } from '../main/DataTableBase';

type DataTableProps = {
  dataDialogHook: {
    state: DataDialogState;
    dispatch: React.Dispatch<DataDialogAction>;
  };
};

export function UseDataTable<T extends RowDataType>(props: DataTableProps) {
  const { dataDialogHook } = props;

  // 選択行の状態
  const [currentRow, setCurrentRow] = useState<T | null>(null);

  // ダイアログを開く
  const handleDialogOpen = useCallback(
    (selectedRow: T) => {
      if (selectedRow.isAuthor) {
        dataDialogHook.dispatch({ type: 'inputOpen' });
      } else {
        dataDialogHook.dispatch({ type: 'readOpen' });
      }
      if (!!selectedRow.seriesMasterId) {
        // 定期イベントの場合は先に確認ダイアログを表示
        dataDialogHook.dispatch({ type: 'recConfOpen' });
      }
      setCurrentRow(selectedRow);
    },
    [dataDialogHook]
  );

  // 定期イベント確認メッセージを閉じる
  const handleRecConfClose = useCallback(
    (isCancel: boolean, master?: T) => {
      if (isCancel) {
        dataDialogHook.dispatch({ type: 'recConfCancel' });
        return;
      }
      if (master) {
        setCurrentRow(master);
      }
      dataDialogHook.dispatch({ type: 'recConfClose' });
    },
    [dataDialogHook]
  );

  return [{ currentRow }, setCurrentRow, handleDialogOpen, handleRecConfClose] as const;
}
