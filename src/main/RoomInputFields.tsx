import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Control, Controller, DeepMap, DeepPartial, FieldError, UseFormSetValue, useWatch } from 'react-hook-form';
import { Box, FormControlLabel, Grid, Switch, TextField } from '@material-ui/core';
import { Room } from '_models/Room';
import { Inputs } from './RowDataInputDialog';
import { get } from 'lodash';

type RoomInputFieldsProps = {
  control: Control<Inputs, object>;
  setValue: UseFormSetValue<Inputs>;
  rooms: Room[] | undefined;
  roomId: string;
  disabledRoom?: boolean;
  errors: DeepMap<DeepPartial<Inputs>, FieldError>;
};

export function RoomInputFields(props: RoomInputFieldsProps) {
  const { control, setValue, rooms, roomId, disabledRoom, errors } = props;

  const { t } = useTranslation();

  // 給茶選択の制御
  const [disabledTeaSupply, setDisabledTeaSupply] = useState(false);

  // 給茶選択の制御用に会議室選択を監視
  const roomWatch = useWatch({ control, name: `resourcies.${roomId}.roomForEdit` });

  // 給茶選択のエフェクト
  useEffect(() => {
    if (!!roomWatch && !!rooms) {
      const result = rooms.some((room) => room.id === roomWatch && room.teaSupply);
      if (!result) setValue(`resourcies.${roomId}.teaSupply`, false);
      setDisabledTeaSupply(!result);
    }
  }, [roomId, roomWatch, rooms, setValue]);

  // 給茶人数の入力制御
  const [disabledTeaMember, setDisabledTeaMember] = useState(false);

  // 給茶人数の制御用に給茶選択を監視
  const teaWatch = useWatch({ control, name: `resourcies.${roomId}.teaSupply` });

  // 給茶人数のエフェクト
  useEffect(() => {
    if (!teaWatch) {
      setValue(`resourcies.${roomId}.numberOfVisitor`, 0);
      setValue(`resourcies.${roomId}.numberOfEmployee`, 0);
    }
    setDisabledTeaMember(!teaWatch);
  }, [teaWatch, setValue, roomId]);

  // 多階層になっている場合の取得回避策
  const getNestedError = (name: string): FieldError => {
    return get(errors, `resourcies.${roomId}.${name}`) as FieldError;
  };

  if (rooms?.length === 0) {
    return (
      <Box px={2} style={{ textAlign: 'center', color: 'red' }}>
        {t('visitdialog.notes.no-relevant-rooms')}
      </Box>
    );
  }

  return (
    <Box px={2}>
      <Controller
        name={`resourcies.${roomId}.roomForEdit`}
        control={control}
        rules={{ required: t('common.form.required') as string }}
        render={({ field }) => (
          <TextField
            {...field}
            select
            disabled={disabledRoom}
            label={t('visittable.header.event-room')}
            error={!!getNestedError('roomForEdit')}
            helperText={!!getNestedError('roomForEdit') && getNestedError('roomForEdit').message}
          >
            {rooms!.map((option) => (
              <option key={option.id} value={option.id}>
                {option.name} {'<'}
                {option.email}
                {'>'}
              </option>
            ))}
          </TextField>
        )}
      />

      <Grid container spacing={1}>
        <Grid item xs={4}>
          <FormControlLabel
            control={
              <Controller
                name={`resourcies.${roomId}.teaSupply`}
                control={control}
                render={({ field }) => (
                  <Switch onChange={(e) => field.onChange(e.target.checked)} checked={field.value} color="primary" disabled={disabledTeaSupply} />
                )}
              />
            }
            label={t('visittable.header.tea-supply')}
          />
        </Grid>

        <Grid item xs={4}>
          <Controller
            name={`resourcies.${roomId}.numberOfVisitor`}
            control={control}
            rules={{ required: t('common.form.required') as string }}
            render={({ field }) => (
              <TextField
                type="number"
                inputProps={{ min: 0, style: { textAlign: 'right' } }}
                {...field}
                disabled={disabledTeaMember}
                label={t('visittable.header.number-of-visitor')}
                error={!!getNestedError('numberOfVisitor')}
                helperText={!!getNestedError('numberOfVisitor') && getNestedError('numberOfVisitor').message}
              />
            )}
          />
        </Grid>

        <Grid item xs={4}>
          <Controller
            name={`resourcies.${roomId}.numberOfEmployee`}
            control={control}
            rules={{ required: t('common.form.required') as string }}
            render={({ field }) => (
              <TextField
                type="number"
                inputProps={{ min: 0, style: { textAlign: 'right' } }}
                {...field}
                disabled={disabledTeaMember}
                label={t('visittable.header.number-of-employee')}
                error={!!getNestedError('numberOfEmployee')}
                helperText={!!getNestedError('numberOfEmployee') && getNestedError('numberOfEmployee').message}
              />
            )}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
