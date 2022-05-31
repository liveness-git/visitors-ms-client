import { cloneElement, useMemo, useState } from 'react';

import { AppBar, Tab } from '@material-ui/core';
import { TabContext, TabList, TabPanel } from '@material-ui/lab';

import { Category } from '_models/Category';
import { useLoadData } from '_utils/useLoadData';

type CategoryTabContextProps = {
  tabPanelContent: React.ReactElement;
};

export function CategoryTabContext(props: CategoryTabContextProps) {
  const { tabPanelContent } = props;

  // タブ切り替え
  const [tabValue, setTabValue] = useState('0');
  const handleTabChange = (_event: React.ChangeEvent<{}>, newValue: string) => {
    setTabValue(newValue);
  };

  // カテゴリ取得
  const [{ data: categories }] = useLoadData<Category[]>(`/category/choices`, []);

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
              {cloneElement(tabPanelContent, { category: cate.id })}
            </TabPanel>
          );
        })}
      </>
    );
  }, [categories, tabPanelContent]);

  return (
    <TabContext value={tabValue}>
      <AppBar position="static" color="default">
        {tabList}
      </AppBar>
      {tabPanels}
    </TabContext>
  );
}
