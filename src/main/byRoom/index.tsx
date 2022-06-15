import React, { useReducer, useState } from 'react';

import { Box, Button, createStyles, Grid, makeStyles, Paper, Typography } from '@material-ui/core';
import AddCircleIcon from '@material-ui/icons/AddCircle';

import { useTranslation } from 'react-i18next';

import BaseTemplate from '../../_components/BaseTemplate';
import { DataTable } from './DataTable';
import { dataDialogReducer, DataDialogState } from '../DataTableBase';
import MyCalendar from '_components/MyCalendar';
import { CategoryTabContext } from 'main/CategoryTabContext';

const useStyles = makeStyles((theme) => {
  return createStyles({
    datePickerArea: {},
    actionButtonArea: {
      textAlign: 'right',
      margin: 'auto',
    },
    datePicker: {
      margin: 'auto 0',
    },
    keyboardDatePicker: {
      '& .MuiOutlinedInput-adornedEnd': { paddingRight: 0 },
    },
    title: {
      margin: 'auto 0.25em',
    },
    button: {
      margin: theme.spacing(1),
    },
  });
});

export function ByRoom() {
  const { t } = useTranslation();
  const classes = useStyles();

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

  // 新規作成ボタン
  const handleCreateClick = (_event: React.ChangeEvent<{}>) => {
    dataDialogDispatch({ type: 'addDataOpen' });
  };

  return (
    <BaseTemplate>
      <Paper square>
        <Box px={2} py={1}>
          <Grid container alignItems="stretch" justifyContent="space-between">
            <Grid container item xs={12} sm={9} className={classes.datePickerArea}>
              <Grid item className={classes.datePicker}>
                <MyCalendar label={t('main.byroom.picker-label')} date={selectedDate} onChange={handleDateChange} />
              </Grid>
              <Grid item className={classes.title}>
                <Typography component="h5">{t('main.byroom.title')}</Typography>
              </Grid>
            </Grid>
            <Grid item xs={12} sm={3} className={classes.actionButtonArea}>
              <Button variant="contained" color="secondary" startIcon={<AddCircleIcon />} onClick={handleCreateClick}>
                {t('main.byroom.add-event')}
              </Button>
            </Grid>
          </Grid>
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
