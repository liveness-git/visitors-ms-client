import { useReducer } from 'react';
import { useTranslation } from 'react-i18next';

import { Box, Paper } from '@material-ui/core';

import BaseTemplate from '../../_components/BaseTemplate';
import { Columns, DataTable } from '../DataTable';
import { dataDialogReducer, DataDialogState } from '../DataTableBase';
import { Inputs } from '../RowDataInputDialog';
import { HeaderActions } from '../HeaderActions';
import { DataInputs } from './DataInputs';

import { Location } from '_models/Location';

export function LocationSettings() {
  const { t } = useTranslation();

  // ダイアログの初期値
  const initialState: DataDialogState = {
    mode: 'addData',
    inputOpen: false,
  };
  // ダイアログの状態
  const [dataDialogState, dataDialogDispatch] = useReducer(dataDialogReducer, initialState);

  const columns: Columns<Location>[] = [
    { title: t('settings.header.location.name'), field: 'name' },
    { title: t('settings.header.location.url'), field: 'url' },
    { title: t('settings.header.location.sort'), field: 'sort' },
  ];

  const defaultValues: Inputs<Location> = {
    mode: 'ins',
    id: '',
    name: '',
    url: '',
    sort: '',
  };

  return (
    <BaseTemplate adminMode menuOpen>
      <Paper square>
        <Box p={2}>
          <HeaderActions master="location" dispatch={dataDialogDispatch}></HeaderActions>
        </Box>
        <Box p={2}>
          <DataTable<Location>
            inputFields={{ type: 'location', item: <DataInputs />, defaultValues: defaultValues }}
            columns={columns}
            dataDialogHook={{ state: dataDialogState, dispatch: dataDialogDispatch }}
          />
        </Box>
      </Paper>
    </BaseTemplate>
  );
}
