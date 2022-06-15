import { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SubmitHandler, useForm } from 'react-hook-form';

import { Box, Grid, Button } from '@material-ui/core';
import { makeStyles, createStyles, createTheme, ThemeProvider } from '@material-ui/core/styles';
import { grey, purple } from '@material-ui/core/colors';

import DeleteIcon from '@material-ui/icons/Delete';
import SaveIcon from '@material-ui/icons/Save';

import { addMinutes } from 'date-fns';
import _ from 'lodash';

import { VisitorInfo, EventInputType } from '_models/VisitorInfo';

import { fetchPostData } from '_utils/FetchPostData';

import { MySnackberContext } from '_components/MySnackbarContext';
import { Spinner } from '_components/Spinner';
import { ControllerTextField } from '_components/ControllerTextField';
import { MyDialog } from '_components/MyDialog';

import { DeleteConfirmDialog } from './DeleteConfirmDialog';

const useStyles = makeStyles((tableTheme) => {
  return createStyles({
    formAction: {
      marginTop: tableTheme.spacing(1),
      marginBottom: tableTheme.spacing(1),
    },
    note: {
      color: 'red',
      fontSize: '0.9em',
      margin: 0,
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
const endTimeBufferMinute = 30; //TODO: Interval config化？
const change5MinuteIntervals = (date: Date) => Math.ceil(date.getTime() / 1000 / 60 / 5) * 1000 * 60 * 5; //TODO: Interval config化？

export type Inputs = {
  mode: 'ins' | 'upd' | 'del';
} & VisitorInfo &
  EventInputType;

export const ADD_ROOM_KEY = 'add-room-01';

export type AddDefaultType = {
  start: Date;
  roomId: string;
};

// 入力フォームの初期値
const getDefaultValues = (start?: Date, roomId?: string) => {
  const startDate = start ? start : new Date();
  const room = roomId ? roomId : '';
  return {
    mode: 'ins',
    iCalUId: '',
    subject: '',
    visitorId: '',
    visitCompany: '',
    visitorName: '',
    mailto: { authors: [], required: [], optional: [] },
    resourcies: {
      [ADD_ROOM_KEY]: {
        roomForEdit: room,
        teaSupply: false,
        numberOfVisitor: 0,
        numberOfEmployee: 0,
      },
    },
    comment: '',
    contactAddr: '',
    startTime: addMinutes(change5MinuteIntervals(startDate), startTimeBufferMinute),
    endTime: addMinutes(change5MinuteIntervals(startDate), startTimeBufferMinute + endTimeBufferMinute),
  } as Inputs;
};

type RowDataInputDialogProps<TRowData> = {
  open: boolean;
  onClose: () => void;
  data: TRowData | null;
  reload: () => void;
  addDefault?: AddDefaultType;
};

export function RowDataInputDialog<TRowData>(props: RowDataInputDialogProps<TRowData>) {
  const { open, onClose, data, reload, addDefault } = props;

  const { t } = useTranslation();
  const classes = useStyles();
  const snackberContext = useContext(MySnackberContext); // スナックバー取得用

  // 削除確認メッセージの状態
  const [delConfOpen, setDelConfOpen] = useState(false);

  // 入力フォームの登録
  const defaultValues = getDefaultValues();
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    setError,
    formState: { errors, isDirty, isSubmitting, dirtyFields },
  } = useForm<Inputs>({ defaultValues });

  // 入力フォームの初期化
  useEffect(() => {
    if (open && !!data) {
      reset({
        mode: 'upd',
        // comment: data.comment,
        // contactAddr: data.contactAddr,
      });
    } else {
      reset(_.cloneDeep(getDefaultValues(addDefault?.start, addDefault?.roomId)));
    }
  }, [data, open, reset, addDefault]);

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
  const onSubmit: SubmitHandler<Inputs> = async (formData) => {
    try {
      let url = '';
      switch (formData.mode) {
        case 'ins':
          url = '/event/create';
          break;
        case 'upd':
          url = '/event/update';
          // url = !data?.visitorId ? '/visitor/create' : '/visitor/update';
          break;
        case 'del':
          url = '/event/delete';
          // url = '/visitor/delete';
          break;
      }
      const result = await fetchPostData(url, { inputs: formData, dirtyFields: dirtyFields });
      if (result!.success) {
        if (formData.mode === 'del') await new Promise((r) => setTimeout(r, 1000)); // MSGraphのイベント削除が反映されるまでのタイムラグを考慮
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

  // 削除確認アクション
  const handleDelConfClose = (deleteOk: boolean) => {
    setDelConfOpen(false);
    if (deleteOk) {
      deleteAction();
    }
  };

  return (
    <>
      <Spinner open={isSubmitting} />
      <MyDialog open={open} onClose={onClose} title={t('visitdialog.title')}>
        <ThemeProvider theme={inputformTheme}>
          <form>
            <Box p={2}>
              <ControllerTextField name="visitCompany" control={control} label={t('visittable.header.visit-company')} required errors={errors} />
              <ControllerTextField name="visitorName" control={control} label={t('visittable.header.visitor-name')} errors={errors} />
              <ControllerTextField name="comment" control={control} label={t('visittable.header.comment')} multiline errors={errors} />
              <ControllerTextField name="contactAddr" control={control} label={t('visittable.header.contact-addr')} errors={errors} />
            </Box>

            <Box px={2}>
              <Grid container justifyContent="space-between" spacing={2} className={classes.formAction}>
                <Grid item xs={!data ? 12 : 6}>
                  <Button onClick={handleSave} variant="contained" color="primary" disabled={!isDirty} startIcon={<SaveIcon />} fullWidth>
                    {t('visitorinfoform.form.save')}
                  </Button>
                </Grid>
                <Grid item xs={6} style={!data ? { display: 'none' } : undefined}>
                  <Button onClick={handleDelete} variant="contained" color="primary" /*disabled={!data}*/ startIcon={<DeleteIcon />} fullWidth>
                    {t('visitorinfoform.form.delete')}
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </form>
        </ThemeProvider>
      </MyDialog>
      <DeleteConfirmDialog open={delConfOpen} onClose={handleDelConfClose}></DeleteConfirmDialog>
    </>
  );
}
