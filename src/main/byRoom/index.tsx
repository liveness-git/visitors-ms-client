import { useEffect, useReducer, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Box, Paper } from '@material-ui/core';

import BaseTemplate from '../../_components/BaseTemplate';
import { useSelectedDate } from '_utils/useSelectedDate';
import { getReloadState, getReloadStateFlg, removeReloadStateFlg, saveReloadState } from '_utils/SessionStrage';

import { DataTable } from './DataTable';
import { DataTableWeekly } from './DataTableWeekly';
import { dataDialogReducer, DataDialogState } from '../DataTableBase';
import { HeaderActions } from '../HeaderActions';
import { CategoryTabContext } from '../CategoryTabContext';
import { RoomTabContext } from 'main/RoomTabContext';
import { BoxStyleType } from 'main/TimeBar';

export type ByRoomState = {
  weekly: boolean;
  changeTab: string | undefined;
  titleLabel: string;
  subtitleLabel: string;
};

export type ByRoomAction = {
  type: 'default' | 'weekly';
  changeTab: string;
};

export const byRoomReducer = (state: ByRoomState, action: ByRoomAction) => {
  switch (action.type) {
    case 'default':
      return { weekly: false, changeTab: action.changeTab, titleLabel: 'main.byroom.title', subtitleLabel: 'main.byroom.subtitle' };
    case 'weekly':
      return {
        weekly: true,
        changeTab: action.changeTab,
        titleLabel: 'main.byroom-weekly.title',
        subtitleLabel: 'main.byroom-weekly.subtitle',
      };
    default:
      return state;
  }
};

export function ByRoom() {
  const { t } = useTranslation();

  // カレンダー選択日の状態
  const [selectedDate, setSelectedDate, handleDateChange, handleDatePrev, handleDateNext, setWeekly] = useSelectedDate();

  // ダイアログの初期値
  const initialState: DataDialogState = {
    mode: 'addData',
    inputOpen: false,
    readOpen: false,
  };
  // ダイアログの状態
  const [dataDialogState, dataDialogDispatch] = useReducer(dataDialogReducer, initialState);

  // １週間表示切替えの状態管理
  const [byRoomState, byRoomDispatch] = useReducer(byRoomReducer, {
    weekly: false,
    changeTab: undefined,
    titleLabel: 'main.byroom.title',
    subtitleLabel: 'main.byroom.subtitle',
  });

  // タイムバー表示範囲の状態
  const [rangeToggle, setRangeToggle] = useState<BoxStyleType>('short');

  // ================================
  // refreshボタンによるreload
  useEffect(() => {
    if (!!getReloadStateFlg()) {
      setSelectedDate(new Date(Number(getReloadState('selectedDate'))));
      byRoomDispatch({ type: !!getReloadState('weekly') ? 'weekly' : 'default', changeTab: getReloadState('tabValue') });
      removeReloadStateFlg();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // ReloadStateStrageの設定
  useEffect(() => {
    if (!getReloadStateFlg()) {
      saveReloadState('weekly', byRoomState.weekly ? '1' : '');
    }
  }, [byRoomState.weekly]);
  // ================================

  // タイムバー表示範囲の切替えアクション
  const handleRangeToggleChange = (value: BoxStyleType) => {
    setRangeToggle(value);
  };

  // デフォルト → １週間表示へ切替えアクション
  const handleDefaultClick = (timestamp: number, _categoryId: string, roomId: string) => {
    setSelectedDate(new Date(timestamp));
    setWeekly(true);
    byRoomDispatch({ type: 'weekly', changeTab: roomId });
  };

  // １週間 → デフォルト表示へ切替えアクション
  const handleWeeklyClick = (timestamp: number, categoryId: string, _roomId: string) => {
    setSelectedDate(new Date(timestamp));
    setWeekly(false);
    byRoomDispatch({ type: 'default', changeTab: categoryId });
  };

  return (
    <BaseTemplate>
      <Paper square>
        <Box p={2}>
          <HeaderActions
            title={t(byRoomState.titleLabel)}
            subtitle={t(byRoomState.subtitleLabel)}
            date={selectedDate}
            onDateChange={handleDateChange}
            onDatePrev={handleDatePrev}
            onDateNext={handleDateNext}
            dispatch={dataDialogDispatch}
          />
        </Box>
        {
          /* デフォルト表示 */
          !byRoomState.weekly && (
            <CategoryTabContext
              tabPanelContent={
                <DataTable
                  currentDate={selectedDate!}
                  dataDialogHook={{ state: dataDialogState, dispatch: dataDialogDispatch }}
                  tabKey="dummyId"
                  rangeToggle={rangeToggle}
                  onChangeRangeToggle={handleRangeToggleChange}
                  onTitleClick={handleDefaultClick}
                />
              }
              selected={byRoomState.changeTab}
            />
          )
        }
        {
          /* １週間表示 */
          byRoomState.weekly && (
            <RoomTabContext
              tabPanelContent={
                <DataTableWeekly
                  currentDate={selectedDate!}
                  dataDialogHook={{ state: dataDialogState, dispatch: dataDialogDispatch }}
                  tabKey="dummyId"
                  rangeToggle={rangeToggle}
                  onChangeRangeToggle={handleRangeToggleChange}
                  onTitleClick={handleWeeklyClick}
                />
              }
              selected={byRoomState.changeTab}
            />
          )
        }
      </Paper>
    </BaseTemplate>
  );
}
