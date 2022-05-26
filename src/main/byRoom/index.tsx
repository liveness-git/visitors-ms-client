import React, { useReducer, useState } from 'react';

import { AppBar, Box, Button, createStyles, Grid, makeStyles, Paper, Typography } from '@material-ui/core';
import Tab from '@material-ui/core/Tab';
import TabContext from '@material-ui/lab/TabContext';
import TabList from '@material-ui/lab/TabList';
import TabPanel from '@material-ui/lab/TabPanel';
import { KeyboardDatePicker } from '@material-ui/pickers';
import AddCircleIcon from '@material-ui/icons/AddCircle';

import { useTranslation } from 'react-i18next';

import BaseTemplate from '../BaseTemplate';
import { DataTable } from './DataTable';
import { dataDialogReducer, DataDialogState } from '../DataTableBase';
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

export function ByRoom() {
  const { t } = useTranslation();
  const classes = useStyles();

  // カレンダー選択日の状態
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
  };

  // タブ切り替え
  const [value, setTabValue] = useState('0');
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

  return (
    <BaseTemplate>
      <Paper square>
        <Box px={2} py={1}>
          <Grid container alignItems="stretch" justifyContent="space-between">
            <Grid container item xs={12} sm={9} className={classes.datePickerArea}>
              <Grid item className={classes.datePicker}>
                <KeyboardDatePicker
                  margin="normal"
                  id="date-picker-dialog"
                  label={t('main.byroom.picker-label')}
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
        <TabContext value={value}>
          <AppBar position="static" color="default">
            <TabList indicatorColor="primary" textColor="primary" variant="fullWidth" onChange={handleTabChange} aria-label="view tabs">
              {/* <Tab label={t('visitlist.tab.conference-rooms')} value="0" />
              <Tab label={t('visitlist.tab.free-space')} value="1" /> */}
              {categories?.map((cate, index) => (
                <Tab key={`tab-${index}`} label={cate.name} value={`${index}`} />
              ))}
            </TabList>
          </AppBar>
          {/* <TabPanel value="0">
            <DataTable currentDate={selectedDate!} dataDialogHook={{ state: dataDialogState, dispatch: dataDialogDispatch }} type="rooms" />
          </TabPanel>
          <TabPanel value="1">
            <DataTable currentDate={selectedDate!} dataDialogHook={{ state: dataDialogState, dispatch: dataDialogDispatch }} type="free" />
          </TabPanel> */}
          {categories?.map((cate, index) => (
            <TabPanel key={`tab-panel-${index}`} value={`${index}`}>
              <DataTable currentDate={selectedDate!} dataDialogHook={{ state: dataDialogState, dispatch: dataDialogDispatch }} category={cate.id} />
            </TabPanel>
          ))}
        </TabContext>
      </Paper>
    </BaseTemplate>
  );
}
