import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Control, Controller, DeepMap, DeepPartial, FieldError } from 'react-hook-form';

import { Autocomplete } from '@material-ui/lab';
import { Chip, CircularProgress, TextField } from '@material-ui/core';

import { EmailAddress } from '_models/VisitorInfo';

import { useLoadData } from '_utils/useLoadData';

import { Inputs } from './RowDataInputDialog';

type AddrBookAutoCompleteType = {
  control: Control<Inputs, object>;
  errors: DeepMap<DeepPartial<Inputs>, FieldError>;
  disabled: boolean;
};

export function AddrBookAutoComplete(props: AddrBookAutoCompleteType) {
  const { control, errors, disabled } = props;

  const { t } = useTranslation();

  // アドレス帳の取得
  const [filter, setFilter] = useState('');
  const [{ data: addressbook, isLoading: loading }] = useLoadData<EmailAddress[]>(`/user/addressbook?filter=${filter}`, []);

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
    <Controller
      name="mailto"
      control={control}
      render={({ field }) => (
        <Autocomplete
          {...field}
          disabled={disabled}
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
          getOptionLabel={(option) => `${option.name} <${option.address}>`}
          renderTags={(tagValue, getTagProps) =>
            tagValue.map((option, index) => <Chip label={option.name} title={option.address} {...getTagProps({ index })} />)
          }
          filterSelectedOptions
          renderInput={(params) => (
            <TextField
              {...params}
              label={t('visittable.header.event-mailto')}
              error={!!errors.mailto}
              helperText={errors.mailto && (errors.mailto as any).message}
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
          onChange={(_, data) => field.onChange(data)}
        />
      )}
    />
  );
}
