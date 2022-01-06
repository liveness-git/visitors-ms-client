import React, { useContext, useState } from 'react';

import { AppBar, Box, Paper, Typography } from '@material-ui/core';
import Tab from '@material-ui/core/Tab';
import TabContext from '@material-ui/lab/TabContext';
import TabList from '@material-ui/lab/TabList';
import TabPanel from '@material-ui/lab/TabPanel';
import { MuiPickersContext } from '@material-ui/pickers/MuiPickersUtilsProvider';

import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';

import BaseTemplate from '../BaseTemplate';
import { DataTable } from './DataTable';
import { KeyboardDatePicker } from '@material-ui/pickers';

export function VisitList() {
  const { t } = useTranslation();

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

  const muiPickContext = useContext(MuiPickersContext); // locale取得用

  return (
    // <BaseTemplate title={title} currentDate={selectedDate} calendarOnChange={handleDateChange}>
    <BaseTemplate>
      <Paper square>
        <Box px={2} py={1}>
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
            style={{ width: 180 }}
          />
          <div style={{ display: 'inline' }}>{t('main.visitlist.title')}</div>
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
