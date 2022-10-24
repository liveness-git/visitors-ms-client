import { useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';

import { Box, Button, List, makeStyles, TextField } from '@material-ui/core';
import { MuiPickersContext } from '@material-ui/pickers';

import { FrontRowData } from './DataTable';

import { RoomReadFields } from 'main/RoomReadFields';
import { LastUpdatedField } from 'main/LastUpdatedField';

import { fetchPostData } from '_utils/FetchPostData';
import { MySnackberContext } from '_components/MySnackbarContext';
import { Spinner } from '_components/Spinner';
import { MyDialog } from '_components/MyDialog';

import { FrontInputType, VisitorInfoFront } from '_models/VisitorInfo';
import { makeTableDialogStyle } from '_styles/TableTheme';

const useRowDataDialogStyles = makeTableDialogStyle();

const useStyles = makeStyles({
  checkAction: {
    textAlign: 'center',
    marginBottom: '10px',
    '& Button': {
      margin: '0 5%',
      width: '40%',
    },
  },
});

type Inputs = {
  mode: 'checkin' | 'checkout';
} & VisitorInfoFront &
  FrontInputType;

type RowDataReadDialogProps = {
  open: boolean;
  onClose: () => void;
  data: FrontRowData;
  reload: () => void;
};

export function RowDataFrontDialog(props: RowDataReadDialogProps) {
  const { open, onClose, data, reload } = props;

  const { t } = useTranslation();
  const classes = useRowDataDialogStyles();
  const frontClasses = useStyles();
  const muiPickContext = useContext(MuiPickersContext); // locale取得用
  const snackberContext = useContext(MySnackberContext); // スナックバー取得用

  // 入力フォームの登録
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting, dirtyFields },
  } = useForm<Inputs>({ reValidateMode: 'onSubmit' });

  // 入力フォームの初期化
  useEffect(() => {
    if (open) {
      reset({
        id: data.visitorId,
        checkIn: data.checkIn,
        checkOut: data.checkOut,
        visitorCardNumber: data.visitorCardNumber,
      });
    } else {
      reset();
    }
  }, [data, open, reset]);

  const timestamp = () => format(new Date(), 'yyyy/MM/dd HH:mm:ss', { locale: muiPickContext?.locale });

  // チェックインaction
  const handleCheckIn = () => {
    setValue('mode', 'checkin');
    setValue('checkIn', timestamp(), { shouldDirty: true });
    handleSubmit(onSubmit)();
  };
  // チェックアウトaction
  const handleCheckOut = () => {
    setValue('mode', 'checkout');
    setValue('checkOut', timestamp(), { shouldDirty: true });
    handleSubmit(onSubmit)();
  };

  // データ送信submit
  const onSubmit = async (formData: Inputs) => {
    try {
      const result = await fetchPostData(`/front/${formData.mode}`, { inputs: formData, dirtyFields: dirtyFields });
      if (result!.success) {
        await reload();
        onClose();
        snackberContext.dispatch({ type: 'success', message: t('common.msg.update-success') });
      } else {
        snackberContext.dispatch({ type: 'error', message: t('common.msg.update-failed') });
      }
    } catch (error) {
      snackberContext.dispatch({ type: 'error', message: (error as Error).message });
    }
  };

  return (
    <>
      <Spinner open={isSubmitting} />
      <MyDialog open={open} onClose={onClose} title={t('visitdialog.title')}>
        <Box p={2}>
          <form>
            <div className={frontClasses.checkAction}>
              <Button onClick={handleCheckIn} variant="contained" color="secondary" disabled={!!data.checkOut}>
                {t('visitdialog.button.check-in')}
              </Button>
              <Button onClick={handleCheckOut} variant="contained" color="secondary" disabled={!data.checkIn}>
                {t('visitdialog.button.check-out')}
              </Button>
            </div>
            <div>
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
                  // required: t('common.form.required') as string,
                })}
                error={!!errors.visitorCardNumber}
                helperText={errors.visitorCardNumber && errors.visitorCardNumber.message}
              />
            </div>
          </form>
        </Box>

        <Box px={2} pt={2}>
          <List disablePadding={true}>
            <li key="app-time" className={classes.list}>
              <div className={classes.title}>{t('visittable.header.appt-time')}</div>
              <div className={classes.field}>{data.apptTime}</div>
            </li>
            <li key="check-in" className={classes.list}>
              <div className={classes.title}>{t('visittable.header.check-in')}</div>
              <div className={classes.field}>{data.checkIn}</div>
            </li>
            <li key="check-out" className={classes.list}>
              <div className={classes.title}>{t('visittable.header.check-out')}</div>
              <div className={classes.field}>{data.checkOut}</div>
            </li>
            {/* <li key="event-subject" className={classes.list}>
              <div className={classes.title}>{t('visittable.header.event-subject')}</div>
              <div className={classes.field}>{data.subject}</div>
            </li> */}
            <li key="visit-company" className={classes.list}>
              <div className={classes.title}>
                {t('visittable.header.visit-company')} /<br />
                {t('visittable.header.visitor-name')}
              </div>
              <div className={classes.field}>
                {data.visitCompany} / {data.visitorName}
              </div>
            </li>
            <li key="number-of-visitor" className={classes.list}>
              <div className={classes.title}>{t('visittable.header.number-of-visitor')}</div>
              <div className={classes.field} style={{ flexBasis: '25%', borderRight: 'none' }}>
                {data.numberOfVisitor}
              </div>
              <div className={classes.title} style={{ flexBasis: '25%', borderLeft: 'none' }}>
                {t('visittable.header.number-of-employee')}
              </div>
              <div className={classes.field} style={{ flexBasis: '25%' }}>
                {data.numberOfEmployee}
              </div>
            </li>
          </List>
        </Box>

        <Box px={2} pt={2}>
          <List disablePadding={true}>
            <li key="comment" className={classes.list}>
              <div className={classes.title}>{t('visittable.header.comment')}</div>
              <div className={classes.field}>{data.comment}</div>
            </li>
          </List>
        </Box>

        {Object.keys(data.resourcies).map((roomId) => {
          return <RoomReadFields key={roomId} data={data.resourcies[roomId]} /*hiddenTeaSupply={data.isMSMultipleLocations}*/ />;
        })}

        <Box px={2} pt={2}>
          <List disablePadding={true}>
            <li key="reservation-name" className={classes.list}>
              <div className={classes.title}>{t('visittable.header.reservation-name')}</div>
              <div className={classes.field}>{data.reservationName}</div>
            </li>
            <li key="contact-addr" className={classes.list}>
              <div className={classes.title}>{t('visittable.header.contact-addr')}</div>
              <div className={classes.field}>{data.contactAddr}</div>
            </li>
          </List>
        </Box>

        <Box p={2}>
          <List disablePadding={true}>
            <li key="datetime" className={classes.list}>
              <div className={classes.title}>{t('visitdialog.header.last-updated')}</div>
              <div className={classes.field}>
                <LastUpdatedField datetime={data.lastUpdated} />
              </div>
            </li>
          </List>
        </Box>
      </MyDialog>
    </>
  );
}
