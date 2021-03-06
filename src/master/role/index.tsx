import { useReducer } from 'react';
import { useTranslation } from 'react-i18next';

import { Box, Paper } from '@material-ui/core';

import BaseTemplate from '../../_components/BaseTemplate';
import { Columns, DataTable } from '../DataTable';
import { dataDialogReducer, DataDialogState } from '../DataTableBase';
import { Inputs } from '../RowDataInputDialog';
import { HeaderActions } from '../HeaderActions';
import { DataInputs } from './DataInputs';

import { Role } from '_models/Role';

export function RoleSettings() {
  const { t } = useTranslation();

  // ダイアログの初期値
  const initialState: DataDialogState = {
    mode: 'addData',
    inputOpen: false,
  };
  // ダイアログの状態
  const [dataDialogState, dataDialogDispatch] = useReducer(dataDialogReducer, initialState);

  const columns: Columns<Role>[] = [
    {
      title: t('settings.header.role.name'),
      field: 'name',
      render: (rowData) => t(`settings.view.role.name.${rowData.name}`),
    },
    // { title: t('settings.header.role.members'), field: 'members' },
  ];

  const defaultValues: Inputs<Role> = {
    mode: 'ins',
    id: '',
    name: 'admin',
    members: [],
  };

  return (
    <BaseTemplate adminMode menuOpen>
      <Paper square>
        <Box p={2}>
          <HeaderActions master="role" dispatch={dataDialogDispatch}></HeaderActions>
        </Box>
        <Box p={2}>
          <DataTable<Role>
            inputFields={{ type: 'role', item: <DataInputs />, defaultValues: defaultValues }}
            columns={columns}
            dataDialogHook={{ state: dataDialogState, dispatch: dataDialogDispatch }}
          />
        </Box>
      </Paper>
    </BaseTemplate>
  );
}
