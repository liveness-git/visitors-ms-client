import React, { useContext, useState } from 'react';

import { AppBar, Paper } from '@material-ui/core';
import Tab from '@material-ui/core/Tab';
import TabContext from '@material-ui/lab/TabContext';
import TabList from '@material-ui/lab/TabList';
import TabPanel from '@material-ui/lab/TabPanel';
import { MuiPickersContext } from '@material-ui/pickers/MuiPickersUtilsProvider';

import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';

import BaseTemplate from '../BaseTemplate';
import { DataTable } from './DataTable';

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
  const title = selectedDate ? format(selectedDate, 'yyyy/MM/dd', { locale: muiPickContext?.locale }) + ' ' + t('visitlist.title') : '';

  return (
    <BaseTemplate title={title} currentDate={selectedDate} calendarOnChange={handleDateChange}>
      <Paper square>
        <TabContext value={value}>
          <AppBar position="static" color="default">
            <TabList indicatorColor="primary" textColor="primary" variant="fullWidth" onChange={handleTabChange} aria-label="view tabs">
              <Tab label={t('visitlist.tab.conference-rooms')} value="1" />
              <Tab label={t('visitlist.tab.free-space')} value="2" />
            </TabList>
          </AppBar>
          <TabPanel value="1">
            <DataTable currentDate={selectedDate!} url="http://localhost:3000/test/testdata1.json" />
          </TabPanel>
          <TabPanel value="2">
            <DataTable currentDate={selectedDate!} url="http://localhost:3000/test/testdata3.json" />
          </TabPanel>
        </TabContext>
      </Paper>
    </BaseTemplate>
  );
}
