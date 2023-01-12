import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Control, Controller, DeepMap, DeepPartial, FieldError, FieldValues, Path } from 'react-hook-form';

import { Autocomplete, createFilterOptions } from '@material-ui/lab';
import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, TextField } from '@material-ui/core';
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
  const [{ data: addressbook, isLoading: loading }, , setUrl] = useLoadData<EmailAddress[]>('', []);
  useEffect(() => {
    if (!!filter) {
      setUrl(`/user/addressbook?filter=${filter}`);
    } else {
      setUrl(``);
    }
  }, [filter, setUrl]);

  // 追加アドレスダイアログの状態
  const [open, setOpen] = useState(false);

  // 追加アドレスの状態
  const [dialogValue, setDialogValue] = useState<EmailAddress>({
    name: '',
    address: '',
  });

  // アドレス帳検索値のリアルタイム取得
  const onChangeHandle = async (value: string) => {
    setFilter(value);
  };

  const handleDialogClose = () => {
    setDialogValue({ name: '', address: '' });
    setOpen(false);
  };

  const handleAddClick = () => {
    // setValue({
    //   name: dialogValue.name,
    //   address: dialogValue.address,
    // });
    console.log(dialogValue); //debug
    handleDialogClose();
  };

  return (
    <Controller<TFieldValues, TName>
      name={name}
      control={control}
      render={({ field }) => (
        <>
          <Autocomplete
            {...field}
            disabled={disabled}
            style={style}
            freeSolo
            multiple
            limitTags={disabled ? undefined : 2}
            size="small"
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
            getOptionLabel={(option) => (!!option.address ? `${option.name} <${option.address}>` : `${option.name}`)}
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
            onChange={(_, data) => {
              // if (typeof data === 'string') {
              //   // timeout to avoid instant validation of the dialog's form.
              //   setTimeout(() => {
              //     setOpen(true);
              //     setDialogValue({ name: data, address: '' });
              //   });
              // } else if (data && data.inputvalue) {
              //   setOpen(true);
              //   setDialogValue({
              //     name: data.name,
              //     address: '',
              //   });
              // } else {
              field.onChange(data);
              // }
            }}
          />
          <Dialog open={open} onClose={handleDialogClose} aria-labelledby="form-dialog-title">
            <DialogContent>
              <DialogContentText>Did you miss any film in our list? Please, add it!</DialogContentText>
              <TextField
                label={t('auto-complete.add-dialog.name')}
                value={dialogValue.name}
                onChange={(event) => setDialogValue({ ...dialogValue, name: event.target.value })}
                autoFocus
              />
              <TextField
                label={t('auto-complete.add-dialog.address')}
                value={dialogValue.address}
                onChange={(event) => setDialogValue({ ...dialogValue, address: event.target.value })}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleDialogClose}>{t('common.button.cancel')}</Button>
              <Button onClick={handleAddClick}>{t('common.button.ok')}</Button>
            </DialogActions>
          </Dialog>
        </>
      )}
    />
  );
}
