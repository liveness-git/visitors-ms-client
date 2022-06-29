import { useTranslation } from 'react-i18next';
import { Control, Controller, DeepMap, DeepPartial, FieldError, FieldValues, Path, useWatch } from 'react-hook-form';

import { ControllerTextField } from '_components/ControllerTextField';
import { AddrBookAutoComplete } from '_components/AddrBookAutoComplete';
import { FormControlLabel, Switch } from '@material-ui/core';
import { useEffect, useState } from 'react';

type DataInputsProps<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>;
  errors: DeepMap<DeepPartial<TFieldValues>, FieldError>;
};

export function DataInputs<TFieldValues extends FieldValues>(props: DataInputsProps<TFieldValues>) {
  const { control, errors } = props;

  const { t } = useTranslation();

  // メンバー表示の制御用に限定公開スイッチを監視
  const isLimitedPublic = useWatch({
    control,
    name: 'limitedPublic' as Path<TFieldValues>,
  });

  //メンバー表示の状態
  const [showMembers, setShowMembers] = useState(false);

  // 給茶選択のエフェクト
  useEffect(() => {
    setShowMembers(isLimitedPublic);
    if (!isLimitedPublic) {
      // setValue('members' as Path<TFieldValues>, []);
    }
  }, [isLimitedPublic]);

  return (
    <>
      <ControllerTextField
        name={'name' as Path<TFieldValues>}
        control={control}
        label={t('settings.header.category.name')}
        required
        errors={errors}
      />
      <ControllerTextField name={'sort' as Path<TFieldValues>} control={control} label={t('settings.header.category.sort')} errors={errors} />
      <FormControlLabel
        control={
          <Controller
            name={'limitedPublic' as Path<TFieldValues>}
            control={control}
            render={({ field }) => <Switch onChange={(e) => field.onChange(e.target.checked)} checked={field.value} color="primary" />}
          />
        }
        label={t('settings.form.Limited-public')}
      />
      <AddrBookAutoComplete
        name={'members' as Path<TFieldValues>}
        control={control}
        label={t('settings.header.category.members')}
        errors={errors}
        style={!showMembers ? { display: 'none' } : undefined}
      />
    </>
  );
}
