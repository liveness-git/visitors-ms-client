import { useReducer, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Box, Paper } from '@material-ui/core';

import BaseTemplate from '../../_components/BaseTemplate';

import { DataTable } from './DataTable';
import { DataTableWeekly } from './DataTableWeekly';
import { dataDialogReducer, DataDialogState } from '../DataTableBase';
import { HeaderActions } from '../HeaderActions';
import { CategoryTabContext } from '../CategoryTabContext';
import { RoomTabContext } from 'main/RoomTabContext';

export type ByRoomState = {
  weekly: boolean;
  tabKey: string;
  titleLabel: string;
  subtitleLabel: string;
};

export type ByRoomAction = {
  type: 'default' | 'weekly';
  tabKey: string;
};

export const byRoomReducer = (state: ByRoomState, action: ByRoomAction) => {
  switch (action.type) {
    case 'default':
      return { ...state, weekly: false, titleLabel: 'main.byroom.title', subtitleLabel: 'main.byroom.subtitle' };
    case 'weekly':
      return { ...state, weekly: true, titleLabel: 'main.byroom-weekly.title', subtitleLabel: 'main.byroom-weekly.subtitle' };
    default:
      return state;
  }
};

export function ByRoom() {
  const { t } = useTranslation();

  // カレンダー選択日の状態
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
  };

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
    tabKey: 'dummyId',
    titleLabel: 'main.byroom.title',
    subtitleLabel: 'main.byroom.subtitle',
  });

  // デフォルト → １週間表示へ切替えアクション
  const handleDefaultClick = (timestamp: number, _categoryId: string, roomId: string) => {
    setSelectedDate(new Date(timestamp));
    console.log('roomId: ', roomId);
    byRoomDispatch({ type: 'weekly', tabKey: roomId });
  };

  // １週間 → デフォルト表示へ切替えアクション
  const handleWeeklyClick = (timestamp: number, categoryId: string, _roomId: string) => {
    setSelectedDate(new Date(timestamp));
    console.log('categoryId: ', categoryId);
    byRoomDispatch({ type: 'default', tabKey: categoryId });
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
                  tabKey={byRoomState.tabKey}
                  onTitleClick={handleDefaultClick}
                />
              }
              selected={byRoomState.tabKey}
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
                  tabKey={byRoomState.tabKey}
                  onTitleClick={handleWeeklyClick}
                />
              }
              selected={byRoomState.tabKey}
              type="rooms"
            />
          )
        }
      </Paper>
    </BaseTemplate>
  );
}
