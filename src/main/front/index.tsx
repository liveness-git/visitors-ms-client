import React, { useMemo, useReducer, useState } from 'react';

import { AppBar, Box, Button, createStyles, Grid, makeStyles, Paper, Tab, Typography } from '@material-ui/core';
import { KeyboardDatePicker } from '@material-ui/pickers';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import { TabContext, TabList, TabPanel } from '@material-ui/lab';

import { useTranslation } from 'react-i18next';

import BaseTemplate from '../BaseTemplate';
import { dataDialogReducer, DataDialogState } from '../DataTableBase';
import { DataTable } from './DataTable';

import { useLoadData } from '_utils/useLoadData';
import { Category } from '_models/Category';

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

export function Front() {
  const { t } = useTranslation();
  const classes = useStyles();

  // カレンダー選択日の状態
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
  };

  // タブ切り替え
  const [tabValue, setTabValue] = useState('0');
  const handleTabChange = (_event: React.ChangeEvent<{}>, newValue: string) => {
    setTabValue(newValue);
  };

  // カテゴリ取得
  const [{ data: categories }] = useLoadData<Category[]>(`/category/choices`, []);

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

  // タブリストの表示（不要レンダリングが起きるためメモ化）
  const tabList = useMemo(() => {
    return (
      <TabList indicatorColor="primary" textColor="primary" variant="fullWidth" onChange={handleTabChange} aria-label="view tabs">
        {categories?.map((cate, index) => (
          <Tab key={`tab-${index}`} label={cate.name} value={`${index}`} />
        ))}
      </TabList>
    );
  }, [categories]);

  // タブパネルの表示（不要レンダリングが起きるためメモ化）
  const tabPanels = useMemo(() => {
    return (
      <>
        {categories?.map((cate, index) => {
          return (
            <TabPanel key={`tab-panel-${index}`} value={`${index}`}>
              <DataTable currentDate={selectedDate!} dataDialogHook={{ state: dataDialogState, dispatch: dataDialogDispatch }} category={cate.id} />
            </TabPanel>
          );
        })}
      </>
    );
  }, [categories, dataDialogState, selectedDate]);

  return (
    <BaseTemplate frontMode>
      <Paper square>
        <Box px={2} py={1}>
          <Grid container alignItems="stretch" justifyContent="space-between">
            <Grid container item xs={12} sm={9} className={classes.datePickerArea}>
              <Grid item className={classes.datePicker}>
                <KeyboardDatePicker
                  margin="normal"
                  id="date-picker-dialog"
                  label={t('main.front.picker-label')}
                  format="yyyy/MM/dd"
                  showTodayButton
                  value={selectedDate}
                  onChange={handleDateChange}
                  KeyboardButtonProps={{
                    'aria-label': 'change date',
                  }}
                  size="small"
                  className={classes.keyboardDatePicker}
                  inputProps={{
                    style: {
                      width: 85,
                    },
                  }}
                />
              </Grid>
              <Grid item className={classes.title}>
                <Typography component="h5">{t('main.front.title')}</Typography>
              </Grid>
            </Grid>
            <Grid item xs={12} sm={3} className={classes.actionButtonArea}>
              <Button variant="contained" color="secondary" startIcon={<AddCircleIcon />} onClick={handleCreateClick}>
                {t('main.front.add-event')}
              </Button>
            </Grid>
          </Grid>
        </Box>
        <TabContext value={tabValue}>
          <AppBar position="static" color="default">
            {tabList}
          </AppBar>
          {tabPanels}
        </TabContext>
      </Paper>
    </BaseTemplate>
  );
}
