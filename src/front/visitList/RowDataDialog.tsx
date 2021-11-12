import { useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';

import { makeStyles, createStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Box, List, TextField } from '@material-ui/core';

import { format } from 'date-fns';
import { MuiPickersContext } from '@material-ui/pickers/MuiPickersUtilsProvider';

import { VisitorInfoFront } from '_models/VisitorInfo';
import { fetchPostData } from '_utils/FetchPostData';
import { MySnackberContext } from '_components/MySnackbarContext';
import { Spinner } from '_components/Spinner';

import { RowData, Columns } from './DataTable';

const useStyles = makeStyles((tableTheme) => {
  const border = '1px solid rgba(0, 0, 0, 0.12)';

  return createStyles({
    border: {
      borderTop: border,
      borderLeft: border,
      borderRight: border,
    },
    list: {
      display: 'flex',
      flexFlow: 'row-wrap',
      width: '100%',
    },
    title: {
      flexBasis: '25%',
      padding: '0.7em',
      backgroundColor: tableTheme.palette.primary.light,
      borderBottom: border,
    },
    field: {
      flexBasis: '75%',
      padding: '0.7em',
      borderBottom: border,
    },
    checkAction: {
      textAlign: 'center',
      marginBottom: '10px',
      '& Button': {
        margin: '0 5%',
        width: '40%',
      },
    },
  });
});

type Inputs = VisitorInfoFront;

type RowDataDialogProps = {
  open: boolean;
  onClose: () => void;
  currentDate: Date;
  data: RowData;
  columns: Columns[];
  setSubmited: ($: boolean) => void;
};

export function RowDataDialog(props: RowDataDialogProps) {
  const { open, onClose, currentDate, data, columns, setSubmited } = props;

  const { t } = useTranslation();
  const classes = useStyles();
  const muiPickContext = useContext(MuiPickersContext); // locale取得用
  const snackberContext = useContext(MySnackberContext); // スナックバー取得用

  // 入力フォームの登録
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<Inputs>();

  // 入力フォームの初期化
  useEffect(() => {
    if (open) {
      reset({
        checkIn: data.checkIn,
        checkOut: data.checkOut,
        visitorCardNumber: data.visitorCardNumber,
      });
    } else {
      reset();
    }
  }, [data.checkIn, data.checkOut, data.visitorCardNumber, open, reset]);

  const timestamp = () => format(new Date(), 'yyyy/MM/dd hh:mm:ss', { locale: muiPickContext?.locale });

  // チェックインaction
  const handleCheckIn = () => {
    setValue('checkIn', timestamp());
    handleSubmit(onSubmit)();
  };
  // チェックアウトaction
  const handleCheckOut = () => {
    setValue('checkOut', timestamp());
    handleSubmit(onSubmit)();
  };

  // データ送信submit
  const onSubmit = async (formData: Inputs) => {
    let result = await fetchPostData('/test/testdata2.json', formData); // TODO: urlの変更
    if (result!.success) {
      setSubmited(true);
      onClose();
      snackberContext.dispatch({ type: 'success', message: t('common.msg.update-success') });
    } else {
      snackberContext.dispatch({ type: 'error', message: t('common.msg.update-failed') });
    }
  };

  const handleCancel = () => {
    onClose();
  };

  // 詳細情報のセット
  const setField = (field: string, value: string | boolean | number) => {
    switch (field) {
      // 予約時間
      case 'apptTime':
        const date = format(currentDate, 'yyyy/MM/dd', { locale: muiPickContext?.locale });
        return date + ' ' + value;
      case 'teaSupply':
        return value ? t('visitdialog.form.tea-supply-yes') : t('visitdialog.form.tea-supply-no');
      // その他
      default:
        return value;
    }
  };

  const listItems = columns.map((column) => {
    let field = column.field;
    let title = column.title;
    let value = data[field as keyof RowData];
    return (
      <li key={field} className={classes.list}>
        <div className={classes.title}>{title}</div>
        <div className={classes.field}>{setField(field, value)}</div>
      </li>
    );
  });

  return (
    <>
      <Spinner open={isSubmitting} />
      <Dialog open={open} onClose={onClose} fullWidth={true} maxWidth="sm" aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">{t('visitdialog.title')}</DialogTitle>
        <DialogContent dividers>
          <Box p={2}>
            <form>
              <div className={classes.checkAction}>
                <Button onClick={handleCheckIn} variant="contained" color="secondary" disabled={!!data.checkOut || isSubmitting}>
                  {t('visitdialog.button.check-in')}
                </Button>
                <Button onClick={handleCheckOut} variant="contained" color="secondary" disabled={!data.checkIn || isSubmitting}>
                  {t('visitdialog.button.check-out')}
                </Button>
              </div>
              <div>
                {/* <input {...register('checkIn')} />
              <input {...register('checkOut')} /> */}
                <TextField
                  margin="normal"
                  fullWidth
                  autoComplete="off"
                  color="secondary"
                  id="visitorCardNumber"
                  label={t('visitdialog.form.visitor-card-number')}
                  // placeholder={t('visitdialog.form.visitor-card-number-placeholder')}
                  autoFocus
                  {...register('visitorCardNumber', {
                    required: t('common.form.required') as string,
                  })}
                  disabled={isSubmitting}
                  error={!!errors.visitorCardNumber}
                  helperText={errors.visitorCardNumber && errors.visitorCardNumber.message}
                />
              </div>
            </form>
          </Box>
          <Box p={2}>
            <List className={classes.border} disablePadding={true}>
              {listItems}
            </List>
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
