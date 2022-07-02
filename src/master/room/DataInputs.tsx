import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FormControlLabel, Switch } from '@material-ui/core';
import { Controller, useFormContext, useWatch } from 'react-hook-form';

import { ControllerTextField } from '_components/ControllerTextField';

import { nameOfRoomType, nameOfUsageRange, Room } from '_models/Room';
import { Location } from '_models/Location';
import { Category } from '_models/Category';

import { Inputs } from '../RowDataInputDialog';

type DataInputsProps = {
  locations: Location[] | undefined;
  categories: Category[] | undefined;
};

export function DataInputs({ locations, categories }: DataInputsProps) {
  const {
    control,
    setValue,
    formState: { errors },
  } = useFormContext<Inputs<Room>>();

  const { t } = useTranslation();

  // 給茶選択の制御
  const [disabledTeaSupply, setDisabledTeaSupply] = useState(false);

  // 給茶選択の制御用にタイプ選択を監視
  const typeWatch = useWatch({ control, name: 'type' });

  // 給茶選択のエフェクト
  useEffect(() => {
    if (typeWatch === 'free') {
      setValue('teaSupply', false);
      setDisabledTeaSupply(true);
    } else {
      setDisabledTeaSupply(false);
    }
  }, [setValue, typeWatch]);

  return (
    <>
      <ControllerTextField name={'name'} control={control} label={t('settings.header.room.name')} required errors={errors} />
      <ControllerTextField
        name={'email'}
        control={control}
        label={t('settings.header.room.email')}
        required
        validation={{
          pattern: {
            // eslint-disable-next-line no-useless-escape
            value: /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
            message: t('settings.form.room.error.email.pattern'),
          },
        }}
        errors={errors}
      />
      <ControllerTextField name={'sort'} control={control} label={t('settings.header.room.sort')} errors={errors} />
      <ControllerTextField
        name={'usageRange'}
        control={control}
        label={t('settings.header.room.usage-range')}
        required
        selectList={nameOfUsageRange.map((value) => {
          return { label: t(`settings.view.room.usage-range.${value}`), value: value };
        })}
        errors={errors}
      />
      <ControllerTextField
        name={'type'}
        control={control}
        label={t('settings.header.room.type')}
        required
        selectList={nameOfRoomType.map((value) => {
          return { label: t(`settings.view.room.type.${value}`), value: value };
        })}
        errors={errors}
      />
      <FormControlLabel
        control={
          <Controller
            name={'teaSupply'}
            control={control}
            render={({ field }) => (
              <Switch onChange={(e) => field.onChange(e.target.checked)} checked={field.value} color="primary" disabled={disabledTeaSupply} />
            )}
          />
        }
        label={t('settings.header.room.tea-supply')}
        style={disabledTeaSupply ? { display: 'none' } : undefined}
      />
      <ControllerTextField
        name={'location'}
        control={control}
        label={t('settings.header.room.location')}
        required
        selectList={locations?.map((location) => {
          return { label: location.name, value: location.id };
        })}
        errors={errors}
      />
      <ControllerTextField
        name={'category'}
        control={control}
        label={t('settings.header.room.category')}
        required
        selectList={categories?.map((category) => {
          return { label: category.name, value: category.id };
        })}
        errors={errors}
      />
    </>
  );
}
