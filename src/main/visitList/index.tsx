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
import { DataDialogAction, dataDialogReducer, DataDialogState, DataTable } from './DataTable';

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

export function VisitList() {
  const { t } = useTranslation();
  const classes = useStyles();

  // カレンダー選択日の状態
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
  };

  // タブ切り替え
  const [value, setTabValue] = useState('1');
  const handleTabChange = (_event: React.ChangeEvent<{}>, newValue: string) => {
    setTabValue(newValue);
  };

  // ダイアログの初期値
  const initialState: DataDialogState = {
    mode: 'addData',
    open: false,
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
                  label={t('main.visitlist.picker-label')}
                  format="yyyy/MM/dd"
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
                <Typography component="h5">{t('main.visitlist.title')}</Typography>
              </Grid>
            </Grid>
            <Grid item xs={12} sm={3} className={classes.actionButtonArea}>
              <Button variant="contained" color="secondary" startIcon={<AddCircleIcon />} onClick={handleCreateClick}>
                {t('main.visitlist.add-event')}
              </Button>
            </Grid>
          </Grid>
        </Box>
        <TabContext value={value}>
          <AppBar position="static" color="default">
            <TabList indicatorColor="primary" textColor="primary" variant="fullWidth" onChange={handleTabChange} aria-label="view tabs">
              <Tab label={t('visitlist.tab.conference-rooms')} value="1" />
              <Tab label={t('visitlist.tab.free-space')} value="2" />
            </TabList>
          </AppBar>
          <TabPanel value="1">
            <DataTable
              currentDate={selectedDate!}
              url={`/event/visitlist?timestamp=${selectedDate!.getTime()}&type=rooms`}
              dataDialogHook={{ state: dataDialogState, dispatch: dataDialogDispatch }}
            />
          </TabPanel>
          <TabPanel value="2">
            <DataTable
              currentDate={selectedDate!}
              url={`/event/visitlist?timestamp=${selectedDate!.getTime()}&type=free`}
              dataDialogHook={{ state: dataDialogState, dispatch: dataDialogDispatch }}
            />
          </TabPanel>
        </TabContext>
      </Paper>
    </BaseTemplate>
  );
}
