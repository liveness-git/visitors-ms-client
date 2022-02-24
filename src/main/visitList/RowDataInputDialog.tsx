import { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Controller, useForm, useWatch } from 'react-hook-form';

import { makeStyles, createStyles, createTheme, ThemeProvider } from '@material-ui/core/styles';
import { grey, purple } from '@material-ui/core/colors';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Box, FormControlLabel, Grid, List, Switch, TextField } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import SaveIcon from '@material-ui/icons/Save';

import { addMinutes } from 'date-fns';

import { VisitorInfoPersonal } from '_models/VisitorInfo';
import { fetchPostData } from '_utils/FetchPostData';
import { MySnackberContext } from '_components/MySnackbarContext';
import { Spinner } from '_components/Spinner';

import { RowData } from './DataTable';
import { DeleteConfirmDialog } from './DeleteConfirmDialog';
import { useLoadData } from '_utils/useLoadData';
import { Room, RoomType } from '_models/Room';
import { DateTimePicker } from '@material-ui/pickers';

const useStyles = makeStyles((tableTheme) => {
  const border = 'thin solid rgba(0, 0, 0, 0.12)';

  return createStyles({
    list: {
      display: 'flex',
      flexFlow: 'row-wrap',
      width: '100%',
      '&:first-child div': {
        borderTop: border,
      },
    },
    title: {
      boxSizing: 'border-box',
      flexBasis: '25%',
      padding: '0.7em',
      backgroundColor: tableTheme.palette.primary.light,
      borderLeft: border,
      borderBottom: border,
    },
    field: {
      boxSizing: 'border-box',
      flexBasis: '75%',
      padding: '0.7em',
      borderRight: border,
      borderBottom: border,
    },
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

type NewDateType = () => Date;
const startTimeBufferMinute = 0;
const endTimeBufferMinute = 30;
const change5MinuteIntervals = (date: Date) => Math.ceil(date.getTime() / 1000 / 60 / 5) * 1000 * 60 * 5;

type EventType = {
  subject: string;
  startTime: NewDateType;
  endTime: NewDateType;
  room: string;
};

type Inputs = {
  mode: 'ins' | 'upd' | 'del';
} & VisitorInfoPersonal &
  EventType;

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
  currentTab: RoomType;
  open: boolean;
  onClose: () => void;
  data: RowData | null;
  reload: () => void;
};

export function RowDataInputDialog(props: RowDataInputDialogProps) {
  const { currentTab, open, onClose, data, reload } = props;

  const { t } = useTranslation();
  const classes = useStyles();
  const snackberContext = useContext(MySnackberContext); // スナックバー取得用

  // 会議室データ取得
  const [{ data: rooms }] = useLoadData<Room[]>(`/room/choices?type=${currentTab}`, []);

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

  const handleCancel = () => {
    onClose();
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
      <Dialog open={open} onClose={onClose} fullWidth={true} maxWidth="sm" aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">{t('visitdialog.title')}</DialogTitle>
        <DialogContent dividers>
          <ThemeProvider theme={inputformTheme}>
            <form>
              <Box p={2}>
                {!!data && (
                  <List disablePadding={true}>
                    <li key="app-time" className={classes.list}>
                      <div className={classes.title}>{t('visittable.header.appt-time')}</div>
                      <div className={classes.field}>{data.apptTime}</div>
                    </li>
                    <li key="room-name" className={classes.list}>
                      <div className={classes.title}>{t('visittable.header.room-name')}</div>
                      <div className={classes.field}>
                        {data.roomName} {'<'}
                        {data.roomEmail}
                        {'>'}
                      </div>
                    </li>
                    <li key="reservation-name" className={classes.list}>
                      <div className={classes.title}>{t('visittable.header.reservation-name')}</div>
                      <div className={classes.field}>{data?.reservationName}</div>
                    </li>
                  </List>
                )}
                {!data && (
                  <>
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
                  </>
                )}
              </Box>

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
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel}>{t('visitdialog.button.cancel')}</Button>
        </DialogActions>
      </Dialog>
      <DeleteConfirmDialog open={delConfOpen} onClose={handleDelConfClose}></DeleteConfirmDialog>
    </>
  );
}
