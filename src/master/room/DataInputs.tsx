import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Controller, useFormContext, useWatch } from 'react-hook-form';
import { FormControlLabel, Typography, Grid, Switch, TextField, withStyles, FormHelperText } from '@material-ui/core';
import MuiAccordion from '@material-ui/core/Accordion';
import MuiAccordionSummary from '@material-ui/core/AccordionSummary';
import MuiAccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import { ControllerTextField } from '_components/ControllerTextField';

import { nameOfRoomType, nameOfUsageRange, Room } from '_models/Room';
import { Location } from '_models/Location';
import { Category } from '_models/Category';

import { Inputs } from '../RowDataInputDialog';

type DataInputsProps = {
  locations: Location[] | undefined;
  categories: Category[] | undefined;
};

const Accordion = withStyles({
  root: {
    border: '1px solid rgba(0, 0, 0, .125)',
    boxShadow: 'none',
    '&:not(:last-child)': {
      borderBottom: 0,
    },
    '&:before': {
      display: 'none',
    },
    '&$expanded': {
      margin: 'auto',
    },
  },
  expanded: {},
})(MuiAccordion);

const AccordionSummary = withStyles({
  root: {
    backgroundColor: 'rgba(0, 0, 0, .03)',
    borderBottom: '1px solid rgba(0, 0, 0, .125)',
    marginBottom: -1,
    minHeight: 48,
    '&$expanded': {
      minHeight: 48,
    },
  },
  content: {
    '&$expanded': {
      margin: '0',
    },
  },
  expanded: {},
})(MuiAccordionSummary);

const AccordionDetails = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiAccordionDetails);

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

  // 予約可能日数の制御用に予約不可選択を監視
  const noReservationsWatch = useWatch({ control, name: 'noReservations' });
  // 予約不可のエフェクト
  useEffect(() => {
    if (noReservationsWatch) {
      setValue('reservationPeriod', 0, { shouldDirty: true });
    }
  }, [noReservationsWatch, setValue]);

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
        <Grid item xs={12} sm={6}>
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
        <Grid item xs={12} sm={6}>
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
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Controller
                name={'displayLivenessRooms'}
                control={control}
                render={({ field }) => <Switch onChange={(e) => field.onChange(e.target.checked)} checked={field.value} color="primary" />}
              />
            }
            label={t('settings.header.room.display-liveness-rooms')}
          />
        </Grid>
      </Grid>

      <Accordion style={{ marginTop: 10 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
          <Typography>{t('settings.header.room.accordion.public-reservations')}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Controller
                    name={'noReservations'}
                    control={control}
                    render={({ field }) => <Switch onChange={(e) => field.onChange(e.target.checked)} checked={field.value} color="primary" />}
                  />
                }
                label={t('settings.header.room.no-reservations')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name={`reservationPeriod`}
                control={control}
                render={({ field }) => (
                  <TextField
                    type="number"
                    disabled={noReservationsWatch}
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
        </AccordionDetails>
      </Accordion>
    </>
  );
}
