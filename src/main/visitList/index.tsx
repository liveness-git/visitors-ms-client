import { useReducer, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Box, Paper } from '@material-ui/core';

import BaseTemplate from '../../_components/BaseTemplate';

import { DataTable } from './DataTable';
import { dataDialogReducer, DataDialogState } from '../DataTableBase';
import { HeaderActions } from '../HeaderActions';

export function VisitList() {
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
          <HeaderActions
            title={t('main.visitlist.title')}
            subtitle={t('main.visitlist.subtitle')}
            date={selectedDate}
            onDateChange={handleDateChange}
            dispatch={dataDialogDispatch}
          />
        </Box>
        <Box px={2} pb={2}>
          <DataTable currentDate={selectedDate!} dataDialogHook={{ state: dataDialogState, dispatch: dataDialogDispatch }} />
        </Box>
      </Paper>
    </BaseTemplate>
  );
}
