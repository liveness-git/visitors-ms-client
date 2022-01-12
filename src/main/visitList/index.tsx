import React, { useState } from 'react';

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

const useStyles = makeStyles((theme) => {
  return createStyles({
    datePicker: {
      '& .MuiOutlinedInput-adornedEnd': { paddingRight: 0 },
    },
    title: {
      // marginTop: '0.5em',
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

  return (
    <BaseTemplate>
      <Paper square>
        <Box px={2} py={1}>
          <Grid container alignItems="center" justifyContent="space-between">
            <Grid container item xs={6}>
              <Grid item>
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
                  className={classes.datePicker}
                  inputProps={{
                    style: {
                      width: 85,
                    },
                  }}
                />
              </Grid>
              <Grid item>
                <Typography component="h5" className={classes.title}>
                  {t('main.visitlist.title')}
                </Typography>
              </Grid>
            </Grid>
            <Grid item xs={6}>
              <Button variant="contained" color="secondary" className={classes.button} startIcon={<AddCircleIcon />}>
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
            <DataTable currentDate={selectedDate!} url={`/event/visitlist?timestamp=${selectedDate!.getTime()}&type=rooms`} />
          </TabPanel>
          <TabPanel value="2">
            <DataTable currentDate={selectedDate!} url={`/event/visitlist?timestamp=${selectedDate!.getTime()}&type=free`} />
          </TabPanel>
        </TabContext>
      </Paper>
    </BaseTemplate>
  );
}
