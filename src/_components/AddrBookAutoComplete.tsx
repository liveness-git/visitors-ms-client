import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Control, Controller, DeepMap, DeepPartial, FieldError, FieldValues, Path } from 'react-hook-form';

import { Autocomplete } from '@material-ui/lab';
import { Chip, CircularProgress, TextField } from '@material-ui/core';
import { CSSProperties } from '@material-ui/styles';

import { EmailAddress } from '_models/User';
import { useLoadData } from '_utils/useLoadData';

type AddrBookAutoCompleteType<TFieldValues extends FieldValues, TName extends Path<TFieldValues>> = {
  name: TName;
  control: Control<TFieldValues>;
  label: string;
  errors: DeepMap<DeepPartial<TFieldValues>, FieldError>;
  disabled?: boolean;
  style?: CSSProperties;
};

export function AddrBookAutoComplete<TFieldValues extends FieldValues, TName extends Path<TFieldValues>>(
  props: AddrBookAutoCompleteType<TFieldValues, TName>
) {
  const { name, control, label, errors, disabled, style } = props;

  const { t } = useTranslation();

  // アドレス帳の取得
  const [filter, setFilter] = useState('');
  const [{ data: addressbook, isLoading: loading }] = useLoadData<EmailAddress[]>(`/user/addressbook`, []);
  // const [{ data: addressbook, isLoading: loading }] = useLoadData<EmailAddress[]>(`/user/addressbook?filter=${filter}`, []); // TODO:前方一致検索の場合

  // アドレス帳検索の状態
  const [open, setOpen] = useState(false);

  // // アドレス帳検索の初期化 // TODO:前方一致検索の場合
  // useEffect(() => {
  //   if (!open) {
  //     setFilter('');
  //   }
  // }, [open]);

  // アドレス帳検索値のリアルタイム取得
  const onChangeHandle = async (value: string) => {
    setFilter(value);
  };

  return (
    <Controller<TFieldValues, TName>
      name={name}
      control={control}
      render={({ field }) => (
        <Autocomplete
          {...field}
          disabled={disabled}
          style={style}
          multiple
          limitTags={disabled ? undefined : 2}
          size="small"
          open={open}
          onOpen={() => {
            setOpen(true);
          }}
          onClose={() => {
            setOpen(false);
          }}
          options={!!addressbook && !!filter ? addressbook : []}
          noOptionsText={t('auto-complete.no-options-text')}
          loading={loading}
          getOptionLabel={(option) => `${option.name} <${option.address}>`}
          renderTags={(tagValue, getTagProps) =>
            tagValue.map((option, index) => <Chip label={option.name} title={option.address} {...getTagProps({ index })} />)
          }
          filterSelectedOptions
          getOptionSelected={(option, value) => option.address === value.address}
          renderInput={(params) => (
            <TextField
              {...params}
              label={label}
              error={!!errors[name]}
              helperText={errors[name] && (errors[name] as FieldError).message}
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
