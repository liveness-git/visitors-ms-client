import { useEffect, useReducer, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Box, Button, Paper } from '@material-ui/core';
import ArchiveOutlinedIcon from '@material-ui/icons/ArchiveOutlined';

import BaseTemplate from '../../_components/BaseTemplate';
import { useSelectedDate } from '_utils/useSelectedDate';
import { getReloadState, getReloadStateFlg, removeReloadStateFlg } from '_utils/SessionStrage';

import { DataTable } from './DataTable';
import { ExportCsvDialog } from './ExportCsvDialog';
import { dataDialogReducer, DataDialogState } from '../DataTableBase';
import { HeaderActions } from '../HeaderActions';
import { CategoryTabContext } from '../CategoryTabContext';

export function Front() {
  const { t } = useTranslation();

  // カレンダー選択日の状態
  const [selectedDate, setSelectedDate] = useSelectedDate();
  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
  };

  // ダイアログの初期値
  const initialState: DataDialogState = {
    mode: 'addData',
    inputOpen: false,
    readOpen: false,
  };
  // ダイアログの状態
  const [dataDialogState, dataDialogDispatch] = useReducer(dataDialogReducer, initialState);

  //  CSV出力ダイアログの状態
  const [exportCsvOpen, setExportCsvOpen] = useState(false);

  // reload用にtabの状態を一時的に保持
  const [changeTab, setChangeTab] = useState('');

  // ================================
  // refreshボタンによるreload
  useEffect(() => {
    if (!!getReloadStateFlg()) {
      setSelectedDate(new Date(Number(getReloadState('selectedDate'))));
      setChangeTab(getReloadState('tabValue'));
      removeReloadStateFlg();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // ================================

  //  CSV出力クリックアクション
  const handleExporCsvClick = () => {
    setExportCsvOpen(true);
  };
  // CSV出力ダイアログ閉じるアクション
  const handleExporCsvClose = () => {
    setExportCsvOpen(false);
  };

  // CSV出力ボタン
  const csvButton = (
    <Button variant="contained" startIcon={<ArchiveOutlinedIcon />} onClick={handleExporCsvClick}>
      {t('main.header.export-csv')}
    </Button>
  );

  return (
    <BaseTemplate frontMode>
      <Paper square>
        <Box p={2}>
          <HeaderActions
            title={t('main.front.title')}
            date={selectedDate}
            onDateChange={handleDateChange}
            dispatch={dataDialogDispatch}
            actionButtons={[csvButton]}
          />
        </Box>
        <Box px={2} pb={2}>
          <DataTable currentDate={selectedDate!} dataDialogHook={{ state: dataDialogState, dispatch: dataDialogDispatch }} />
        </Box>
      </Paper>
      <ExportCsvDialog open={exportCsvOpen} onClose={handleExporCsvClose} />
    </BaseTemplate>
  );
}
