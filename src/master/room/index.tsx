import React, { useReducer } from 'react';

import { useTranslation } from 'react-i18next';

import { Box, Button, Grid, makeStyles, Paper, Typography } from '@material-ui/core';
import AddCircleIcon from '@material-ui/icons/AddCircle';

import BaseTemplate from '../../_components/BaseTemplate';
import { Columns, DataTable } from '../DataTable';
import { dataDialogReducer, DataDialogState } from '../DataTableBase';

import { Room } from '_models/Room';
import { Inputs } from 'master/RowDataInputDialog';

const useStyles = makeStyles(() => ({
  actionButtonArea: {
    textAlign: 'right',
    margin: 'auto',
  },
}));

export function RoomSettings() {
  const { t } = useTranslation();
  const classes = useStyles();

  // ダイアログの初期値
  const initialState: DataDialogState = {
    mode: 'addData',
    inputOpen: false,
    readOpen: false,
  };
  // ダイアログの状態
  const [dataDialogState, dataDialogDispatch] = useReducer(dataDialogReducer, initialState);

  const columns: Columns[] = [
    { title: t('settings.header.room.name'), field: 'name' },
    { title: t('settings.header.room.email'), field: 'email' },
    { title: t('settings.header.room.type'), field: 'type' },
    { title: t('settings.header.room.sort'), field: 'sort' },
    { title: t('settings.header.room.tea-supply'), field: 'teaSupply' },
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
        <Box px={2} py={2}>
          <Grid container alignItems="stretch" justifyContent="space-between">
            <Grid container item xs={12} sm={9}>
              <Typography component="h1" variant="h6">
                {t('settings.title.room')}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={3} className={classes.actionButtonArea}>
              <Button variant="contained" color="secondary" startIcon={<AddCircleIcon />}>
                {t('settings.add-master')}
              </Button>
            </Grid>
          </Grid>
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
