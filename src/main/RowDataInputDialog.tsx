import { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Controller, useForm, useWatch } from 'react-hook-form';

import { Box, FormControlLabel, Grid, Switch, TextField, Button } from '@material-ui/core';
import { makeStyles, createStyles, createTheme, ThemeProvider } from '@material-ui/core/styles';
import { grey, purple } from '@material-ui/core/colors';

import DeleteIcon from '@material-ui/icons/Delete';
import SaveIcon from '@material-ui/icons/Save';

import { DateTimePicker } from '@material-ui/pickers';

import { addMinutes } from 'date-fns';

import { VisitorInfoPersonal, MsEventInputType } from '_models/VisitorInfo';
import { Room } from '_models/Room';

import { fetchPostData } from '_utils/FetchPostData';
import { useLoadData } from '_utils/useLoadData';

import { MySnackberContext } from '_components/MySnackbarContext';
import { Spinner } from '_components/Spinner';

import { RowDataType } from './DataTableBase';
import { RowDataBaseDialog, useRowDataDialogStyles } from './RowDataBaseDialog';
import { DeleteConfirmDialog } from './DeleteConfirmDialog';

const useStyles = makeStyles((tableTheme) => {
  return createStyles({
    formAction: {
      marginTop: tableTheme.spacing(1),
      marginBottom: tableTheme.spacing(1),
    },
  });
});

const inputformTheme = createTheme({
  palette: {
    primary: {
      main: purple[500],
    },
    secondary: {
      main: grey[300],
    },
  },
  props: {
    MuiTextField: {
      variant: 'outlined',
      margin: 'dense',
      fullWidth: true,
      minRows: 4,
    },
  },
});

const startTimeBufferMinute = 0;
const endTimeBufferMinute = 30;
const change5MinuteIntervals = (date: Date) => Math.ceil(date.getTime() / 1000 / 60 / 5) * 1000 * 60 * 5;

type Inputs = {
  mode: 'ins' | 'upd' | 'del';
} & VisitorInfoPersonal &
  MsEventInputType;

// 入力フォームの初期値
const defaultValues: Inputs = {
  mode: 'ins',
  iCalUId: '',
  visitorId: '',
  visitCompany: '',
  visitorName: '',
  teaSupply: false,
  numberOfVisitor: 0,
  numberOfEmployee: 0,
  comment: '',
  contactAddr: '',
  subject: '',
  startTime: () => addMinutes(change5MinuteIntervals(new Date()), startTimeBufferMinute),
  endTime: () => addMinutes(change5MinuteIntervals(new Date()), startTimeBufferMinute + endTimeBufferMinute),
  room: '',
};
type RowDataInputDialogProps = {
  open: boolean;
  onClose: () => void;
  data: RowDataType | null;
  reload: () => void;
};

export function RowDataInputDialog(props: RowDataInputDialogProps) {
  const { open, onClose, data, reload } = props;

  const { t } = useTranslation();
  const classes = { ...useRowDataDialogStyles(), ...useStyles() };
  const snackberContext = useContext(MySnackberContext); // スナックバー取得用

  // 会議室データ取得
  const [{ data: rooms }] = useLoadData<Room[]>(`/room/choices`, []);

  // 削除確認メッセージの状態
  const [delConfOpen, setDelConfOpen] = useState(false);

  // 入力フォームの登録
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    setError,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<Inputs>({ defaultValues });

  // 給茶選択の制御
  const [disabledTeaSupply, setDisabledTeaSupply] = useState(false);

  // 給茶選択の制御用に会議室選択を監視
  const roomWatch = useWatch({ control, name: 'room' });

  // 給茶選択のエフェクト(更新時)
  useEffect(() => {
    if (!!data && !!rooms) {
      const result = rooms.some((room) => room.email === data.roomEmail && room.teaSupply);
      setDisabledTeaSupply(!result);
    }
  }, [data, rooms]);
  // 給茶選択のエフェクト(新規作成時)
  useEffect(() => {
    if (!!roomWatch && !!rooms) {
      const result = rooms.some((room) => room.id === roomWatch && room.teaSupply);
      if (!result) setValue('teaSupply', false);
      setDisabledTeaSupply(!result);
    }
  }, [roomWatch, rooms, setValue]);

  // 入力フォームの初期化
  useEffect(() => {
    if (open && !!data) {
      reset({
        mode: 'upd',
        iCalUId: data.iCalUId,
        visitorId: data.visitorId,
        visitCompany: data.visitCompany,
        visitorName: data.visitorName,
        teaSupply: data.teaSupply,
        numberOfVisitor: data.numberOfVisitor,
        numberOfEmployee: data.numberOfEmployee,
        comment: data.comment,
        contactAddr: data.contactAddr,
      });
    } else {
      reset(defaultValues);
    }
  }, [data, open, reset]);

  // 保存アクション
  const handleSave = () => {
    handleSubmit(onSubmit)();
  };
  // 削除アクション(確認メッセージ)
  const handleDelete = () => {
    setDelConfOpen(true);
  };
  // 削除アクション
  const deleteAction = () => {
    setValue('mode', 'del');
    handleSubmit(onSubmit)();
  };

  // データ送信submit
  const onSubmit = async (formData: Inputs) => {
    try {
      let url = '';
      switch (formData.mode) {
        case 'ins':
          url = '/event/addevent';
          // url = '/visitor/create';
          break;
        case 'upd':
          url = !data?.visitorId ? '/visitor/create' : '/visitor/update';
          break;
        case 'del':
          url = '/visitor/delete';
          break;
      }
      const result = await fetchPostData(url, formData);
      if (result!.success) {
        await reload();
        onClose();
        snackberContext.dispatch({ type: 'success', message: t('common.msg.update-success') });
      } else {
        // エラー判定のセット
        if (result!.errors) {
          const errors = result!.errors;
          for (let key in errors) {
            let name = key as keyof Inputs;
            setError(name, { message: t(errors[name]![0]) });
          }
        }
        // snackberContext.dispatch({ type: 'error', message: t('common.msg.update-failed') });
      }
    } catch (error) {
      snackberContext.dispatch({ type: 'error', message: (error as Error).message });
    }
  };

  const handleDelConfClose = (deleteOk: boolean) => {
    setDelConfOpen(false);
    if (deleteOk) {
      deleteAction();
    }
  };

  return (
    <>
      <Spinner open={isSubmitting} />
      <RowDataBaseDialog open={open} onClose={onClose} data={data}>
        <ThemeProvider theme={inputformTheme}>
          <form>
            {!data && (
              <Box p={2}>
                <Controller
                  name="subject"
                  control={control}
                  rules={{ required: t('common.form.required') as string }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={t('visittable.header.event-subject')}
                      error={!!errors.subject}
                      helperText={errors.subject && errors.subject.message}
                    />
                  )}
                />
                <Controller
                  name="room"
                  control={control}
                  rules={{ required: t('common.form.required') as string }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      select
                      label={t('visittable.header.event-room')}
                      error={!!errors.room}
                      helperText={errors.room && errors.room.message}
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
                  <Grid item xs={6}>
                    <Controller
                      name="startTime"
                      control={control}
                      rules={{ required: t('common.form.required') as string }}
                      render={({ field }) => (
                        <DateTimePicker
                          {...field}
                          ampm={false}
                          format="yyyy/MM/dd HH:mm"
                          disablePast
                          minutesStep={5}
                          label={t('visittable.header.event-start-time')}
                          error={!!errors.startTime}
                          helperText={errors.startTime && errors.startTime.message}
                          ref={null}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Controller
                      name="endTime"
                      control={control}
                      rules={{ required: t('common.form.required') as string }}
                      render={({ field }) => (
                        <DateTimePicker
                          {...field}
                          ampm={false}
                          format="yyyy/MM/dd HH:mm"
                          disablePast
                          minutesStep={5}
                          label={t('visittable.header.event-end-time')}
                          error={!!errors.endTime}
                          helperText={errors.endTime && errors.endTime.message}
                          ref={null}
                        />
                      )}
                    />
                  </Grid>
                </Grid>
              </Box>
            )}

            <Box px={2}>
              <Controller
                name="visitCompany"
                control={control}
                rules={{ required: t('common.form.required') as string }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label={t('visittable.header.visit-company')}
                    error={!!errors.visitCompany}
                    helperText={errors.visitCompany && errors.visitCompany.message}
                  />
                )}
              />

              <Controller
                name="visitorName"
                control={control}
                // rules={{ required: t('common.form.required') as string }}
                render={({ field }) => (
                  <TextField
                    multiline
                    {...field}
                    label={t('visittable.header.visitor-name')}
                    error={!!errors.visitorName}
                    helperText={errors.visitorName && errors.visitorName.message}
                  />
                )}
              />

              <Grid container spacing={1}>
                <Grid item xs={4}>
                  <FormControlLabel
                    control={
                      <Controller
                        name="teaSupply"
                        control={control}
                        render={({ field }) => (
                          <Switch
                            onChange={(e) => field.onChange(e.target.checked)}
                            checked={field.value}
                            color="primary"
                            disabled={disabledTeaSupply}
                          />
                        )}
                      />
                    }
                    label={t('visittable.header.tea-supply')}
                  />
                </Grid>

                <Grid item xs={4}>
                  <Controller
                    name="numberOfVisitor"
                    control={control}
                    rules={{ required: t('common.form.required') as string }}
                    render={({ field }) => (
                      <TextField
                        type="number"
                        inputProps={{ min: 0, style: { textAlign: 'right' } }}
                        {...field}
                        label={t('visittable.header.number-of-visitor')}
                        error={!!errors.numberOfVisitor}
                        helperText={errors.numberOfVisitor && errors.numberOfVisitor.message}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={4}>
                  <Controller
                    name="numberOfEmployee"
                    control={control}
                    rules={{ required: t('common.form.required') as string }}
                    render={({ field }) => (
                      <TextField
                        type="number"
                        inputProps={{ min: 0, style: { textAlign: 'right' } }}
                        {...field}
                        label={t('visittable.header.number-of-employee')}
                        error={!!errors.numberOfEmployee}
                        helperText={errors.numberOfEmployee && errors.numberOfEmployee.message}
                      />
                    )}
                  />
                </Grid>
              </Grid>

              <Controller
                name="comment"
                control={control}
                // rules={{ required: t('common.form.required') as string }}
                render={({ field }) => (
                  <TextField
                    multiline
                    {...field}
                    label={t('visittable.header.comment')}
                    error={!!errors.comment}
                    helperText={errors.comment && errors.comment.message}
                  />
                )}
              />

              <Controller
                name="contactAddr"
                control={control}
                // rules={{ required: t('common.form.required') as string }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label={t('visittable.header.contact-addr')}
                    error={!!errors.contactAddr}
                    helperText={errors.contactAddr && errors.contactAddr.message}
                  />
                )}
              />

              <Grid container justifyContent="space-between" spacing={2} className={classes.formAction}>
                <Grid item xs={!data || !data.visitorId ? 12 : 6}>
                  <Button onClick={handleSave} variant="contained" color="primary" disabled={!isDirty} startIcon={<SaveIcon />} fullWidth>
                    {t('visitorinfoform.form.save')}
                  </Button>
                </Grid>
                <Grid item xs={6} style={!data || !data.visitorId ? { display: 'none' } : undefined}>
                  <Button onClick={handleDelete} variant="contained" color="primary" /*disabled={!data}*/ startIcon={<DeleteIcon />} fullWidth>
                    {t('visitorinfoform.form.delete')}
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </form>
        </ThemeProvider>
      </RowDataBaseDialog>
      <DeleteConfirmDialog open={delConfOpen} onClose={handleDelConfClose}></DeleteConfirmDialog>
    </>
  );
}
