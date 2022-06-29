import { useReducer } from 'react';
import { useTranslation } from 'react-i18next';

import { Box, Paper } from '@material-ui/core';

import BaseTemplate from '../../_components/BaseTemplate';
import { Columns, DataTable } from '../DataTable';
import { dataDialogReducer, DataDialogState } from '../DataTableBase';

import { Room } from '_models/Room';
import { Inputs } from 'master/RowDataInputDialog';
import { HeaderActions } from 'master/HeaderActions';

export function RoomSettings() {
  const { t } = useTranslation();

  // ダイアログの初期値
  const initialState: DataDialogState = {
    mode: 'addData',
    inputOpen: false,
  };
  // ダイアログの状態
  const [dataDialogState, dataDialogDispatch] = useReducer(dataDialogReducer, initialState);

  const columns: Columns<Room>[] = [
    { title: t('settings.header.room.name'), field: 'name' },
    { title: t('settings.header.room.email'), field: 'email' },
    { title: t('settings.header.room.type'), field: 'type' },
    { title: t('settings.header.room.sort'), field: 'sort' },
    { title: t('settings.header.room.tea-supply'), field: 'teaSupply', type: 'boolean' },
    { title: t('settings.header.room.location'), field: 'location' },
    { title: t('settings.header.room.category'), field: 'category' },
  ];

  const defaultValues: Inputs<Room> = {
    mode: 'ins',
    id: '',
    name: '',
    email: '',
    type: 'rooms',
    sort: '',
    teaSupply: false,
    location: '',
    category: '',
  };

  return (
    <BaseTemplate adminMode menuOpen>
      <Paper square>
        <Box p={2}>
          <HeaderActions master="room" dispatch={dataDialogDispatch}></HeaderActions>
        </Box>
        <Box p={2}>
          <DataTable<Room>
            master="room"
            columns={columns}
            defaultValues={defaultValues}
            dataDialogHook={{ state: dataDialogState, dispatch: dataDialogDispatch }}
          />
        </Box>
      </Paper>
    </BaseTemplate>
  );
}
