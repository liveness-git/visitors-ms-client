import { cloneElement, useMemo, useState } from 'react';

import { AppBar, Tab } from '@material-ui/core';
import { TabContext, TabList, TabPanel } from '@material-ui/lab';

interface TabModel {
  id: string;
  name: string;
}

type MyTabContextProps<T extends TabModel> = {
  data: Array<T> | undefined;
  tabPanelContent: React.ReactElement;
};

export function MyTabContext<T extends TabModel>(props: MyTabContextProps<T>) {
  const { data, tabPanelContent } = props;

  // タブ切り替え
  const [tabValue, setTabValue] = useState('0');
  const handleTabChange = (_event: React.ChangeEvent<{}>, newValue: string) => {
    setTabValue(newValue);
  };

  // タブリストの表示（不要レンダリングが起きるためメモ化）
  const tabList = useMemo(() => {
    return (
      <TabList indicatorColor="primary" textColor="primary" variant="fullWidth" onChange={handleTabChange} aria-label="view tabs">
        {data?.map((item, index) => (
          <Tab key={`tab-${index}`} label={item.name} value={`${index}`} />
        ))}
      </TabList>
    );
  }, [data]);

  // タブパネルの表示（不要レンダリングが起きるためメモ化）
  const tabPanels = useMemo(() => {
    return (
      <>
        {data?.map((item, index) => {
          return (
            <TabPanel key={`tab-panel-${index}`} value={`${index}`}>
              {cloneElement(tabPanelContent, { tabKey: item.id })}
            </TabPanel>
          );
        })}
      </>
    );
  }, [data, tabPanelContent]);

  return (
    <TabContext value={tabValue}>
      <AppBar position="static" color="default">
        {tabList}
      </AppBar>
      {tabPanels}
    </TabContext>
  );
}
