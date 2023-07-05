import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Control, Controller, DeepMap, DeepPartial, FieldError, FieldValues, Path } from 'react-hook-form';

import { Autocomplete, createFilterOptions } from '@material-ui/lab';
import { CircularProgress, TextField } from '@material-ui/core';
import { CSSProperties } from '@material-ui/styles';

import { EmailAddress } from '_models/User';
import { useLoadData } from '_utils/useLoadData';
import { MyChip } from './MyChip';

const createFilter = createFilterOptions<EmailAddress>();

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
  const [{ data: addressbook, isLoading: addrLoding, isError: addrError }, , setUrl] = useLoadData<EmailAddress[]>('', []);
  useEffect(() => {
    if (!!filter) {
      setUrl(`/user/addressbook?filter=${filter}`);
    } else {
      setUrl(``);
    }
  }, [filter, setUrl]);

  // アドレス帳検索のローディング状態
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (addrLoding && !addrError) {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [addrError, addrLoding]);

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
    if (value.length > 2) setFilter(value);
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
          filterOptions={(options, params) => {
            const filtered = createFilter(options, params) as EmailAddress[];
            if (params.inputValue !== '') {
              filtered.push({
                name: params.inputValue,
                address: params.inputValue,
              });
            }
            return filtered;
          }}
          noOptionsText={t('auto-complete.no-options-text')}
          loading={loading}
          getOptionLabel={(option) => `${option.name} <${option.address}>`}
          renderTags={(tagValue, getTagProps) => tagValue.map((option, index) => <MyChip option={option} {...getTagProps({ index })} />)}
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
