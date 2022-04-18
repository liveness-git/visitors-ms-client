import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ControllerFieldState, ControllerRenderProps, DeepMap, DeepPartial, FieldError, NestedValue, UseFormStateReturn } from 'react-hook-form';

import { Autocomplete } from '@material-ui/lab';
import { CircularProgress, TextField } from '@material-ui/core';

import { Address } from '_models/VisitorInfo';

import { useLoadData } from '_utils/useLoadData';

import { Inputs } from './RowDataInputDialog';

type AddrBookAutoCompleteType = {
  autoCompProps: {
    field: ControllerRenderProps<Inputs, 'mailto'>;
    fieldState: any;
    formState: UseFormStateReturn<Inputs>;
  };
  errors: DeepMap<DeepPartial<Inputs>, FieldError>;
};

export function AddrBookAutoComplete(props: AddrBookAutoCompleteType) {
  const { autoCompProps, errors } = props;

  const { t } = useTranslation();

  // アドレス帳の取得
  const [filter, setFilter] = useState('');
  const [{ data: addressbook, isLoading: loading }] = useLoadData<Address[]>(`/user/addressbook?filter=${filter}`, []);

  // アドレス帳検索の状態
  const [open, setOpen] = useState(false);

  // アドレス帳検索の初期化
  useEffect(() => {
    if (!open) {
      setFilter('');
    }
  }, [open]);

  // アドレス帳検索値のリアルタイム取得
  const onChangeHandle = async (value: string) => {
    setFilter(value);
  };

  return (
    <Autocomplete
      {...autoCompProps}
      multiple
      limitTags={2}
      size="small"
      open={open}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      options={addressbook ? addressbook : []}
      loading={loading}
      getOptionLabel={(option) => option.name}
      filterSelectedOptions
      renderInput={(params) => (
        <TextField
          {...params}
          label={t('visittable.header.event-mailto')}
          error={!!errors.mailto}
          helperText={errors.mailto && errors.mailto.message}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
          onChange={(ev) => {
            if (ev.target.value !== '' || ev.target.value !== null) {
              onChangeHandle(ev.target.value);
            }
          }}
        />
      )}
      onChange={(_, data) => autoCompProps.field.onChange(data)}
    />
  );
}
