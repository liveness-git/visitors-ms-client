import { useTranslation } from 'react-i18next';
import { Control, Controller, DeepMap, DeepPartial, FieldError, FieldValues, Path, useWatch } from 'react-hook-form';
import { FormControlLabel, Switch } from '@material-ui/core';

import { ControllerTextField } from '_components/ControllerTextField';
import { AddrBookAutoComplete } from '_components/AddrBookAutoComplete';
import { useEffect, useState } from 'react';

import { Category } from '_models/Category';

import { Inputs } from 'master/RowDataInputDialog';

type DataInputsProps = {
  control: Control<Inputs<Category>>;
  errors: DeepMap<DeepPartial<Inputs<Category>>, FieldError>;
};

export function DataInputs(props: DataInputsProps) {
  const { control, errors } = props;

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
      // setValue('members', []);
    }
  }, [isLimitedPublic]);

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
        label={t('settings.form.Limited-public')}
      />
      <AddrBookAutoComplete
        name={'members'}
        control={control}
        label={t('settings.header.category.members')}
        errors={errors}
        style={!showMembers ? { display: 'none' } : undefined}
      />
    </>
  );
}
