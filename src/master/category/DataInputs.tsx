import { useTranslation } from 'react-i18next';
import { Controller, useFormContext, useWatch } from 'react-hook-form';
import { FormControlLabel, Switch } from '@material-ui/core';

import { ControllerTextField } from '_components/ControllerTextField';
import { AddrBookAutoComplete } from '_components/AddrBookAutoComplete';
import { useEffect, useState } from 'react';

import { Category } from '_models/Category';

import { Inputs } from '../RowDataInputDialog';

export function DataInputs() {
  const {
    control,
    setValue,
    formState: { errors },
  } = useFormContext<Inputs<Category>>();

  const { t } = useTranslation();

  // メンバー表示の制御用に限定公開スイッチを監視
  const isLimitedPublic = useWatch({
    control,
    name: 'limitedPublic',
  });

  //メンバー表示の状態
  const [showMembers, setShowMembers] = useState(false);

  // 給茶選択のエフェクト
  useEffect(() => {
    setShowMembers(isLimitedPublic);
    if (!isLimitedPublic) {
      setValue('members', [], { shouldDirty: true });
    }
  }, [isLimitedPublic, setValue]);

  return (
    <>
      <ControllerTextField name={'name'} control={control} label={t('settings.header.category.name')} required errors={errors} />
      <ControllerTextField name={'sort'} control={control} label={t('settings.header.category.sort')} errors={errors} />
      <FormControlLabel
        control={
          <Controller
            name={'limitedPublic'}
            control={control}
            render={({ field }) => <Switch onChange={(e) => field.onChange(e.target.checked)} checked={field.value} color="primary" />}
          />
        }
        label={t('settings.header.category.limited-public')}
      />
      <AddrBookAutoComplete
        name={'members'}
        control={control}
        label={t('settings.header.category.members')}
        errors={errors}
        style={!showMembers ? { display: 'none' } : undefined}
      />
      <FormControlLabel
        control={
          <Controller
            name={'disabledByRoom'}
            control={control}
            render={({ field }) => <Switch onChange={(e) => field.onChange(e.target.checked)} checked={field.value} color="primary" />}
          />
        }
        label={t('settings.header.category.disabled-by-room')}
      />
    </>
  );
}
