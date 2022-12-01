import { useReducer } from 'react';
import { useTranslation } from 'react-i18next';

import { Box, Paper } from '@material-ui/core';

import BaseTemplate from '../../_components/BaseTemplate';
import { Columns, DataTable } from '../DataTable';
import { dataDialogReducer, DataDialogState } from '../DataTableBase';
import { Inputs } from '../RowDataInputDialog';
import { HeaderActions } from '../HeaderActions';
import { DataInputs } from './DataInputs';

import { Category } from '_models/Category';

export function CategorySettings() {
  const { t } = useTranslation();

  // ダイアログの初期値
  const initialState: DataDialogState = {
    mode: 'addData',
    inputOpen: false,
  };
  // ダイアログの状態
  const [dataDialogState, dataDialogDispatch] = useReducer(dataDialogReducer, initialState);

  const columns: Columns<Category>[] = [
    { title: t('settings.header.category.name'), field: 'name' },
    { title: t('settings.header.category.sort'), field: 'sort' },
    { title: t('settings.header.category.limited-public'), field: 'limitedPublic', type: 'boolean' },
    // { title: t('settings.header.category.members'), field: 'members' },
    { title: t('settings.header.category.disabled-by-room'), field: 'disabledByRoom', type: 'boolean' },
  ];

  const defaultValues: Inputs<Category> = {
    mode: 'ins',
    id: '',
    name: '',
    sort: '',
    limitedPublic: false,
    members: [],
    disabledByRoom: false,
  };

  return (
    <BaseTemplate adminMode menuOpen>
      <Paper square>
        <Box p={2}>
          <HeaderActions master="category" dispatch={dataDialogDispatch}></HeaderActions>
        </Box>
        <Box p={2}>
          <DataTable<Category>
            inputFields={{ type: 'category', item: <DataInputs />, defaultValues: defaultValues }}
            columns={columns}
            dataDialogHook={{ state: dataDialogState, dispatch: dataDialogDispatch }}
          />
        </Box>
      </Paper>
    </BaseTemplate>
  );
}
