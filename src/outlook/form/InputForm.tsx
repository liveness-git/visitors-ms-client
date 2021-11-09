import { useEffect } from 'react';

import { TextField, Button, Grid, Switch, FormControlLabel } from '@material-ui/core';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import DeleteIcon from '@material-ui/icons/Delete';
import SaveIcon from '@material-ui/icons/Save';

import { useForm, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { post, get, HttpResponse, PostDataResult } from '_components/utils/Http';
import { useLoadData } from '_components/utils/useLoadData';
import { Spinner } from '_components/utils/Spinner';

import { VisitorInfoPersonal } from '_components/VisitorInfo';

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

export function InputForm() {
  const { t } = useTranslation();
  const classes = useStyles();

  // データ取得
  const [{ data, isLoading }, reload] = useLoadData<VisitorInfoPersonal>('http://localhost:3000/test/testdata4.json', undefined);

  // 入力フォームの登録
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<Inputs>({ defaultValues });

  // 入力フォームの初期化
  useEffect(() => {
    if (data) {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

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
    let response: HttpResponse<PostDataResult<Inputs>>;
    try {
      // TODO: get→postへの切り替え＋urlの変更
      // response = await post<postDataResult<Inputs>>('http://localhost:3000/', formData);
      response = await get<PostDataResult<Inputs>>('http://localhost:3000/test/testdata2.json');
      console.log('formData', formData);
      console.log('response', response);

      const result = response.parsedBody;
      if (result!.success) {
        console.log('Success');
        reload();
      } else {
        console.log('Failed'); //TODO: alert化
      }
    } catch (error) {
      console.log('Error', error); //TODO: alert化
    }
  };

  return (
    <>
      <Spinner open={isLoading} />
      <form onSubmit={handleSubmit(onSubmit)}>
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
          <Grid item xs={6} sm={4}>
            <Button onClick={handleSave} variant="contained" color="primary" startIcon={<SaveIcon />} fullWidth>
              {t('visitorinfoform.form.save')}
            </Button>
          </Grid>
          <Grid item xs={6} sm={4}>
            <Button onClick={handleDelete} variant="contained" color="primary" startIcon={<DeleteIcon />} fullWidth>
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
