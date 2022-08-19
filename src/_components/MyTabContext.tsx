import { cloneElement, useEffect, useMemo, useState } from 'react';

import { AppBar, Tab } from '@material-ui/core';
import { TabContext, TabList, TabPanel } from '@material-ui/lab';

import { getReloadStateFlg, saveReloadState } from '_utils/SessionStrage';

interface TabModel {
  id: string;
  name: string;
}

type MyTabContextProps<T extends TabModel> = {
  data: Array<T>;
  tabPanelContent: React.ReactElement;
  selected?: string;
};

export function MyTabContext<T extends TabModel>(props: MyTabContextProps<T>) {
  const { data, tabPanelContent, selected } = props;

  // タブパネルとタブリストの描画が揃ってから表示するための制御
  const [activateTab, setActivateTab] = useState(false);
  useEffect(() => setActivateTab(true), []);

  // タブの状態
  const [tabValue, setTabValue] = useState('');

  // タブの自動選択
  useEffect(() => {
    if (!!selected) {
      setTabValue(selected);
    } else {
      setTabValue(data[0].id);
    }
  }, [data, selected]);

  // ================================
  // ReloadStateStrageの設定
  useEffect(() => {
    if (!getReloadStateFlg()) {
      saveReloadState('tabValue', tabValue);
    }
  }, [tabValue]);
  // ================================

  // タブ切り替えアクション
  const handleTabChange = (_event: React.ChangeEvent<{}>, newValue: string) => {
    setTabValue(newValue);
  };

  // タブリストの表示（不要レンダリングが起きるためメモ化）
  const tabList = useMemo(() => {
    return (
      <TabList indicatorColor="primary" textColor="primary" variant="scrollable" onChange={handleTabChange} aria-label="view tabs">
        {data?.map((item, index) => (
          <Tab key={`tab-${index}`} label={item.name} value={`${item.id}`} />
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
            <TabPanel key={`tab-panel-${index}`} value={`${item.id}`}>
              {cloneElement(tabPanelContent, { tabKey: item.id })}
            </TabPanel>
          );
        })}
      </>
    );
  }, [data, tabPanelContent]);

  if (!activateTab) {
    return <></>;
  }

  return (
    <TabContext value={tabValue}>
      <AppBar position="static" color="default">
        {tabList}
      </AppBar>
      {tabPanels}
    </TabContext>
  );
}
