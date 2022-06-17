import { useReducer, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Box, Paper } from '@material-ui/core';

import BaseTemplate from '../../_components/BaseTemplate';

import { DataTable } from './DataTable';
import { dataDialogReducer, DataDialogState } from '../DataTableBase';
import { HeaderActions } from '../HeaderActions';
import { CategoryTabContext } from '../CategoryTabContext';

export function ByRoom() {
  const { t } = useTranslation();

  // カレンダー選択日の状態
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
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

  return (
    <BaseTemplate>
      <Paper square>
        <Box p={2}>
          <HeaderActions title={t('main.byroom.title')} date={selectedDate} onDateChange={handleDateChange} dispatch={dataDialogDispatch} />
        </Box>
        <CategoryTabContext
          tabPanelContent={
            <DataTable currentDate={selectedDate!} dataDialogHook={{ state: dataDialogState, dispatch: dataDialogDispatch }} category="dummyId" />
          }
        />
      </Paper>
    </BaseTemplate>
  );
}
