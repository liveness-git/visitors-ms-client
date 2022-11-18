import { useReducer } from 'react';
import { useTranslation } from 'react-i18next';

import { Box, Paper } from '@material-ui/core';

import BaseTemplate from '../../_components/BaseTemplate';
import { Columns, DataTable } from '../DataTable';
import { dataDialogReducer, DataDialogState } from '../DataTableBase';
import { Inputs } from '../RowDataInputDialog';
import { HeaderActions } from '../HeaderActions';
import { DataInputs } from './DataInputs';

import { Room } from '_models/Room';
import { useLoadData } from '_utils/useLoadData';
import { Location } from '_models/Location';
import { Category } from '_models/Category';

export function RoomSettings() {
  const { t } = useTranslation();

  // ダイアログの初期値
  const initialState: DataDialogState = {
    mode: 'addData',
    inputOpen: false,
  };
  // ダイアログの状態
  const [dataDialogState, dataDialogDispatch] = useReducer(dataDialogReducer, initialState);

  // ロケーションデータ取得
  const [{ data: locations }] = useLoadData<Location[]>(`/location/choices`, []);

  // カテゴリデータ取得
  const [{ data: categories }] = useLoadData<Category[]>(`/category/choices`, []);

  const fieldTeaSupply = (result: boolean) => {
    return result ? t('settings.view.room.tea-supply-true') : t('settings.view.room.tea-supply-false');
  };
  const columns: Columns<Room>[] = [
    { title: t('settings.header.room.name'), field: 'name' },
    // { title: t('settings.header.room.email'), field: 'email' },
    { title: t('settings.header.room.sort'), field: 'sort' },
    {
      title: t('settings.header.room.usage-range'),
      field: 'usageRange',
      render: (rowData) => t(`settings.view.room.usage-range.${rowData.usageRange}`),
    },
    { title: t('settings.header.room.type'), field: 'type', render: (rowData) => t(`settings.view.room.type.${rowData.type}`) },
    {
      title: t('settings.header.room.tea-supply'),
      field: 'teaSupply',
      type: 'boolean',
      sorting: false,
      render: (rowData) => {
        if (rowData.usageRange === 'none') {
          return (
            <>
              <span>
                {t('settings.view.room.tea-supply.outside')}
                {fieldTeaSupply(rowData.teaSupply.outside)}
              </span>
              <br />
              <span>
                {t('settings.view.room.tea-supply.inside')}
                {fieldTeaSupply(rowData.teaSupply.inside)}
              </span>
            </>
          );
        } else {
          return <span>{fieldTeaSupply(rowData.teaSupply[rowData.usageRange])}</span>;
        }
      },
    },
    {
      title: t('settings.header.room.location'),
      field: 'location',
      render: (rowData) => {
        const target = locations?.find((location) => location.id === rowData.location);
        return target?.name;
      },
    },
    {
      title: t('settings.header.room.category'),
      field: 'category',
      render: (rowData) => {
        const target = categories?.find((category) => category.id === rowData.category);
        return target?.name;
      },
    },
  ];

  const defaultValues: Inputs<Room> = {
    mode: 'ins',
    id: '',
    name: '',
    email: '',
    usageRange: 'none',
    type: 'rooms',
    sort: '',
    teaSupply: { outside: false, inside: false },
    comment: '',
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
            inputFields={{ type: 'room', item: <DataInputs locations={locations} categories={categories} />, defaultValues: defaultValues }}
            columns={columns}
            dataDialogHook={{ state: dataDialogState, dispatch: dataDialogDispatch }}
          />
        </Box>
      </Paper>
    </BaseTemplate>
  );
}
