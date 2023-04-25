import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Controller, useFormContext, useWatch } from 'react-hook-form';
import { FormControlLabel, Grid, Switch, TextField } from '@material-ui/core';

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
      setValue('teaSupply', { outside: false, inside: false }, { shouldDirty: true });
      setDisabledTeaSupply(true);
    } else {
      setDisabledTeaSupply(false);
    }
  }, [setValue, typeWatch]);

  // 給茶選択の制御用に利用範囲を監視
  const usageRangeWatch = useWatch({ control, name: 'usageRange' });
  // 利用範囲のエフェクト
  useEffect(() => {
    switch (usageRangeWatch) {
      case 'outside':
        setValue('teaSupply.inside', false, { shouldDirty: true });
        break;
      case 'inside':
        setValue('teaSupply.outside', false, { shouldDirty: true });
        break;
      default:
        break;
    }
  }, [setValue, usageRangeWatch]);

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
      <Grid container style={disabledTeaSupply ? { display: 'none' } : undefined}>
        <Grid item>
          <FormControlLabel
            control={
              <Controller
                name={'teaSupply.outside'}
                control={control}
                render={({ field }) => (
                  <Switch onChange={(e) => field.onChange(e.target.checked)} checked={field.value} color="primary" disabled={disabledTeaSupply} />
                )}
              />
            }
            label={t('settings.header.room.tea-supply.outside')}
            style={usageRangeWatch === 'inside' ? { display: 'none' } : undefined}
          />
        </Grid>
        <Grid item>
          <FormControlLabel
            control={
              <Controller
                name={'teaSupply.inside'}
                control={control}
                render={({ field }) => (
                  <Switch onChange={(e) => field.onChange(e.target.checked)} checked={field.value} color="primary" disabled={disabledTeaSupply} />
                )}
              />
            }
            label={t('settings.header.room.tea-supply.inside')}
            style={usageRangeWatch === 'outside' ? { display: 'none' } : undefined}
          />
        </Grid>
      </Grid>
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
      <ControllerTextField name="comment" control={control} label={t('settings.header.room.comment')} multiline errors={errors} />
      <Grid container>
        <Grid item>
          <FormControlLabel
            control={
              <Controller
                name={'cleaningOption'}
                control={control}
                render={({ field }) => <Switch onChange={(e) => field.onChange(e.target.checked)} checked={field.value} color="primary" />}
              />
            }
            label={t('settings.header.room.cleaning-option')}
          />
        </Grid>
        <Grid item>
          <FormControlLabel
            control={
              <Controller
                name={'onlyDuringWorkHours'}
                control={control}
                render={({ field }) => <Switch onChange={(e) => field.onChange(e.target.checked)} checked={field.value} color="primary" />}
              />
            }
            label={t('settings.header.room.only-during-work-hours')}
          />
        </Grid>
      </Grid>
      <Grid container>
        <Grid item sm={4}>
          <Controller
            name={`reservationPeriod`}
            control={control}
            render={({ field }) => (
              <TextField
                type="number"
                inputProps={{ min: 0, style: { textAlign: 'right' } }}
                {...field}
                label={t('settings.header.room.reservation-periode')}
                error={!!errors.reservationPeriod}
                helperText={!!errors.reservationPeriod && errors.reservationPeriod.message}
              />
            )}
          />
        </Grid>
      </Grid>
    </>
  );
}
