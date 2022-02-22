import { useEffect, useContext } from 'react';

import { TextField, Button, Grid, Switch, FormControlLabel } from '@material-ui/core';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import DeleteIcon from '@material-ui/icons/Delete';
import SaveIcon from '@material-ui/icons/Save';

import { useForm, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { useLoadData } from '_utils/useLoadData';
import { fetchPostData } from '_utils/FetchPostData';
import { MySnackberContext } from '_components/MySnackbarContext';
import { Spinner } from '_components/Spinner';

import { VisitorInfoPersonal } from '_models/VisitorInfo';

const useStyles = makeStyles((theme) =>
  createStyles({
    formAction: {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
    },
  })
);

type Inputs = {
  mode: 'ins' | 'upd' | 'del';
} & VisitorInfoPersonal;

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
};

export function InputForm() {
  const { t } = useTranslation();
  const classes = useStyles();

  const snackberContext = useContext(MySnackberContext); // スナックバー取得用

  // データ取得
  const [{ data, isLoading, isError }, reload] = useLoadData<VisitorInfoPersonal>('/test/testdata4.json', undefined);

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
    if (data) {
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
  }, [data, reset]);

  // 保存アクション
  const handleSave = () => {
    handleSubmit(onSubmit)();
  };
  // 削除アクション
  const handleDelete = () => {
    setValue('mode', 'del');
    handleSubmit(onSubmit)();
  };
  // キャンセルアクション
  const handleCancel = () => {
    reload();
  };

  // データ送信submit
  const onSubmit = async (formData: Inputs) => {
    try {
      let result = await fetchPostData('/test/testdata2.json', formData); // TODO: urlの変更
      if (result!.success) {
        await reload();
        snackberContext.dispatch({ type: 'success', message: t('common.msg.update-success') });
      } else {
        snackberContext.dispatch({ type: 'error', message: t('common.msg.update-failed') });
      }
    } catch (error) {
      snackberContext.dispatch({ type: 'error', message: (error as Error).message });
    }
  };

  // データ取得失敗した場合
  if (isError) {
    return <div>{t('common.msg.fetch-failed')}</div>;
  }

  return (
    <>
      <Spinner open={isLoading || isSubmitting} />
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
          <Grid item xs={12} md={4}>
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

          <Grid item xs={6} md={4}>
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

          <Grid item xs={6} md={4}>
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
          <Grid item xs={6} sm={4}>
            <Button onClick={handleSave} variant="contained" color="primary" disabled={!isDirty} startIcon={<SaveIcon />} fullWidth>
              {t('visitorinfoform.form.save')}
            </Button>
          </Grid>
          <Grid item xs={6} sm={4}>
            <Button onClick={handleDelete} variant="contained" color="primary" disabled={!data} startIcon={<DeleteIcon />} fullWidth>
              {t('visitorinfoform.form.delete')}
            </Button>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Button onClick={handleCancel} variant="contained" fullWidth>
              {t('visitorinfoform.form.cancel')}
            </Button>
          </Grid>
        </Grid>
      </form>
    </>
  );
}
