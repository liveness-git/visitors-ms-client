import { useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Controller, useForm } from 'react-hook-form';

import { makeStyles, createStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Box, FormControlLabel, Grid, List, Switch, TextField } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import SaveIcon from '@material-ui/icons/Save';

import { format } from 'date-fns';
import { MuiPickersContext } from '@material-ui/pickers/MuiPickersUtilsProvider';

import { VisitorInfoPersonal } from '_models/VisitorInfo';
import { fetchPostData } from '_utils/FetchPostData';
import { MySnackberContext } from '_components/MySnackbarContext';
import { Spinner } from '_components/Spinner';

import { RowData } from './DataTable';

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

// type Inputs = VisitorInfoFront;
type Inputs = {
  mode: 'ins' | 'upd' | 'del';
} & VisitorInfoPersonal;

const defaultValues: Inputs = {
  mode: 'ins',
  key: '',
  visitCompany: '',
  visitorName: '',
  reservationName: '',
  teaSupply: false,
  numberOfVisitor: 0,
  numberOfEmployee: 0,
  comment: '',
  contactAddr: '',
};
type RowDataDialogProps = {
  open: boolean;
  onClose: () => void;
  currentDate: Date;
  data: RowData | null;
  setSubmited: ($: boolean) => void;
};

export function RowDataDialog(props: RowDataDialogProps) {
  const { open, onClose, currentDate, data, setSubmited } = props;

  const { t } = useTranslation();
  const classes = useStyles();
  const muiPickContext = useContext(MuiPickersContext); // locale取得用
  const snackberContext = useContext(MySnackberContext); // スナックバー取得用

  // 入力フォームの登録
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<Inputs>({ defaultValues });

  // 入力フォームの初期化
  useEffect(() => {
    if (open && !!data) {
      reset({
        mode: 'upd',
        key: data.key,
        visitCompany: data.visitCompany,
        visitorName: data.visitorName,
        teaSupply: data.teaSupply,
        numberOfVisitor: data.numberOfVisitor,
        numberOfEmployee: data.numberOfEmployee,
        comment: data.comment,
        reservationName: data.reservationName,
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
  // 削除アクション
  const handleDelete = () => {
    setValue('mode', 'del');
    handleSubmit(onSubmit)();
  };

  // データ送信submit
  const onSubmit = async (formData: Inputs) => {
    try {
      let result = await fetchPostData('/test/testdata2.json', formData); // TODO: urlの変更
      if (result!.success) {
        setSubmited(true);
        onClose();
        snackberContext.dispatch({ type: 'success', message: t('common.msg.update-success') });
      } else {
        snackberContext.dispatch({ type: 'error', message: t('common.msg.update-failed') });
      }
    } catch (error) {
      snackberContext.dispatch({ type: 'error', message: (error as Error).message });
    }
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <>
      <Spinner open={isSubmitting} />
      <Dialog open={open} onClose={onClose} fullWidth={true} maxWidth="sm" aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">{t('visitdialog.title')}</DialogTitle>
        <DialogContent dividers>
          <Box p={2}>
            {!!!data && <>test</>}
            {!!data && (
              <List disablePadding={true}>
                <li key="app-time" className={classes.list}>
                  <div className={classes.title}>{t('visittable.header.appt-time')}</div>
                  <div className={classes.field}>{format(currentDate, 'yyyy/MM/dd', { locale: muiPickContext?.locale }) + ' ' + data.apptTime}</div>
                </li>
                <li key="room-name" className={classes.list}>
                  <div className={classes.title}>{t('visittable.header.room-name')}</div>
                  <div className={classes.field}>{data.roomName}</div>
                </li>
              </List>
            )}
          </Box>

          <Box px={2}>
            <form>
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
                        render={({ field }) => <Switch onChange={(e) => field.onChange(e.target.checked)} checked={field.value} />}
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
                name="reservationName"
                control={control}
                rules={{ required: t('common.form.required') as string }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label={t('visittable.header.reservation-name')}
                    error={!!errors.reservationName}
                    helperText={errors.reservationName && errors.reservationName.message}
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
                <Grid item xs={!data ? 12 : 6}>
                  <Button onClick={handleSave} variant="contained" color="secondary" disabled={!isDirty} startIcon={<SaveIcon />} fullWidth>
                    {t('visitorinfoform.form.save')}
                  </Button>
                </Grid>
                <Grid item xs={6} style={!data ? { display: 'none' } : undefined}>
                  <Button onClick={handleDelete} variant="contained" color="secondary" /*disabled={!data}*/ startIcon={<DeleteIcon />} fullWidth>
                    {t('visitorinfoform.form.delete')}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} color="secondary">
            {t('visitdialog.button.cancel')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
