import React, { useReducer } from 'react';

import { useTranslation } from 'react-i18next';

import { Box, Button, Grid, makeStyles, Paper, Typography } from '@material-ui/core';
import AddCircleIcon from '@material-ui/icons/AddCircle';

import BaseTemplate from '../../_components/BaseTemplate';
import { Columns, DataTable } from '../DataTable';
import { dataDialogReducer, DataDialogState } from '../DataTableBase';

import { Category } from '_models/Category';
import { Inputs } from 'master/RowDataInputDialog';

const useStyles = makeStyles(() => ({
  actionButtonArea: {
    textAlign: 'right',
    margin: 'auto',
  },
}));

export function CategorySettings() {
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
    { title: t('settings.header.category.name'), field: 'name' },
    { title: t('settings.header.category.sort'), field: 'sort' },
    { title: t('settings.header.category.members'), field: 'members' },
  ];

  const defaultValues: Inputs<Category> = {
    mode: 'ins',
    id: '',
    name: '',
    sort: '',
    members: [],
  };

  return (
    <BaseTemplate adminMode menuOpen>
      <Paper square>
        <Box px={2} py={2}>
          <Grid container alignItems="stretch" justifyContent="space-between">
            <Grid container item xs={12} sm={9}>
              <Typography component="h1" variant="h6">
                {t('settings.title.category')}
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
          <DataTable<Category>
            master="category"
            columns={columns}
            defaultValues={defaultValues}
            dataDialogHook={{ state: dataDialogState, dispatch: dataDialogDispatch }}
          />
        </Box>
      </Paper>
    </BaseTemplate>
  );
}
