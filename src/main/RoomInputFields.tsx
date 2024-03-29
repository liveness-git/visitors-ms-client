import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Control,
  Controller,
  DeepMap,
  DeepPartial,
  FieldError,
  UseFormClearErrors,
  UseFormGetValues,
  UseFormSetValue,
  useWatch,
} from 'react-hook-form';
import {
  Box,
  Button,
  CircularProgress,
  FormControlLabel,
  Grid,
  InputAdornment,
  makeStyles,
  MenuItem,
  Switch,
  TextField,
  Typography,
} from '@material-ui/core';
import { Room } from '_models/Room';
import { Inputs } from './RowDataInputDialog';
import { get } from 'lodash';

const useStyles = makeStyles({
  roomComment: {
    whiteSpace: 'pre-line',
    fontSize: '0.75rem',
    lineHeight: '1rem',
    padding: '0 5px 5px 5px',
  },
});

type RoomInputFieldsProps = {
  control: Control<Inputs, object>;
  setValue: UseFormSetValue<Inputs>;
  getValues: UseFormGetValues<Inputs>;
  clearErrors: UseFormClearErrors<Inputs>;
  rooms: Room[] | undefined;
  roomsLoading: boolean;
  roomsError: boolean;
  roomsReload: () => void;
  roomId: string;
  disabledVisitor: boolean;
  disabledRoom?: boolean;
  errors: DeepMap<DeepPartial<Inputs>, FieldError>;
};

export function RoomInputFields(props: RoomInputFieldsProps) {
  const { control, setValue, getValues, clearErrors, rooms, roomsLoading, roomsError, roomsReload, roomId, disabledVisitor, disabledRoom, errors } =
    props;

  const { t } = useTranslation();
  const classes = useStyles();

  // 給茶選択の制御
  const [disabledTeaSupply, setDisabledTeaSupply] = useState(false);

  // 給茶選択の制御用に会議室選択を監視
  const roomWatch = useWatch({ control, name: `resourcies.${roomId}.roomForEdit` });

  // 給茶選択のエフェクト
  useEffect(() => {
    if (getValues('mode') === 'upd') return; // 更新時、会議室変更は出来ないため非対応
    if (!!roomWatch && !!rooms) {
      const result = rooms.some((room) => room.id === roomWatch && room.teaSupply[getValues('usageRange')]);
      if (!result) setValue(`resourcies.${roomId}.teaSupply`, false, { shouldDirty: true });
      setDisabledTeaSupply(!result);
    } else {
      setValue(`resourcies.${roomId}.teaSupply`, false, { shouldDirty: true });
      setDisabledTeaSupply(true);
    }
  }, [getValues, roomId, roomWatch, rooms, setValue]);

  // 給茶人数の入力制御
  const [disabledTeaMember, setDisabledTeaMember] = useState(false);

  // 給茶人数の制御用に給茶選択を監視
  const teaWatch = useWatch({ control, name: `resourcies.${roomId}.teaSupply` });

  // 給茶人数のエフェクト
  useEffect(() => {
    if (!teaWatch) {
      clearErrors([`resourcies.${roomId}.numberOfTeaSupply`, `resourcies.${roomId}.teaDetails`]);
      setValue(`resourcies.${roomId}.numberOfTeaSupply`, 0, { shouldDirty: true });
      setValue(`resourcies.${roomId}.teaDetails`, '', { shouldDirty: true });
    }
    setDisabledTeaMember(!teaWatch);
  }, [teaWatch, setValue, roomId, clearErrors]);

  //会議室の説明文
  const [roomComment, setRoomComment] = useState('');
  useEffect(() => {
    if (!!roomWatch && !!rooms) {
      const room = rooms.filter((room) => room.id === roomWatch && !!room.comment)[0];
      const comment = !!room ? room.comment : '';
      setRoomComment(comment);
    } else {
      setRoomComment('');
    }
  }, [roomWatch, rooms]);

  // 多階層になっている場合の取得回避策
  const getNestedError = (name: string): FieldError => {
    return get(errors, `resourcies.${roomId}.${name}`) as FieldError;
  };

  if (roomsLoading && roomsError) {
    return (
      <Box px={2}>
        <TextField
          label={t(`visittable.header.room-name`)}
          value={t('common.msg.fetch-failed')}
          disabled
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Button color="primary" onClick={roomsReload}>
                  retry
                </Button>
              </InputAdornment>
            ),
          }}
        />
      </Box>
    );
  }

  if (roomsLoading) {
    return (
      <Box px={2}>
        <TextField
          label={t(`visittable.header.room-name`)}
          value={t('visitdialog.notes.loading-rooms')}
          disabled
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <CircularProgress color="inherit" style={{ padding: 10 }} />
              </InputAdornment>
            ),
          }}
        />
      </Box>
    );
  }

  if (!roomsLoading && rooms?.length === 0) {
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
        rules={{
          required: t('common.form.required') as string,
          // 何らかの挙動で選択リストから消えた会議室を選択している場合のエラー処理
          validate: (roomId) => (rooms!.some((room) => room.id === roomId) ? undefined : (t('visitdialog.form.error.room-not-covered') as string)),
        }}
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
              <MenuItem key={option.id} value={option.id}>
                {option.name}
              </MenuItem>
            ))}
          </TextField>
        )}
      />
      <Typography component="div" className={classes.roomComment}>
        {roomComment}
      </Typography>

      <Grid container spacing={1} style={disabledTeaSupply ? { display: 'none' } : undefined}>
        <Grid item xs={5} sm={4}>
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

        <Grid item xs={2} sm={4} style={disabledVisitor ? { opacity: 0 } : undefined}></Grid>

        <Grid item xs={5} sm={4}>
          <Controller
            name={`resourcies.${roomId}.numberOfTeaSupply`}
            control={control}
            rules={{
              required: t('common.form.required') as string,
              validate: () =>
                (getValues(`resourcies.${roomId}.teaSupply`) && getValues(`resourcies.${roomId}.numberOfTeaSupply`) > 0) ||
                (!getValues(`resourcies.${roomId}.teaSupply`) && getValues(`resourcies.${roomId}.numberOfTeaSupply`) === 0) ||
                (t('visitdialog.form.error.number-of-tea-supply') as string),
            }}
            render={({ field }) => (
              <TextField
                type="number"
                inputProps={{ min: 0, style: { textAlign: 'right' } }}
                {...field}
                disabled={disabledTeaMember}
                label={t('visittable.header.number-of-tea-supply')}
                error={!!getNestedError('numberOfTeaSupply')}
                helperText={!!getNestedError('numberOfTeaSupply') && getNestedError('numberOfTeaSupply').message}
              />
            )}
          />
        </Grid>

        <Controller
          name={`resourcies.${roomId}.teaDetails`}
          control={control}
          render={({ field }) => (
            <TextField
              style={disabledTeaMember ? { display: 'none' } : undefined}
              multiline
              {...field}
              disabled={disabledTeaMember}
              label={t('visittable.header.tea-details')}
              error={!!getNestedError('teaDetails')}
              helperText={!!getNestedError('teaDetails') && getNestedError('teaDetails').message}
            />
          )}
        />
      </Grid>
    </Box>
  );
}
