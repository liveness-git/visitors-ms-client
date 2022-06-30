import { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DeepPartial, Path, PathValue, SubmitHandler, UnpackNestedValue, useForm, FieldValues } from 'react-hook-form';

import { Box, Grid, Button } from '@material-ui/core';
import { makeStyles, createStyles, createTheme, ThemeProvider } from '@material-ui/core/styles';
import { grey, purple } from '@material-ui/core/colors';

import DeleteIcon from '@material-ui/icons/Delete';
import SaveIcon from '@material-ui/icons/Save';

import _ from 'lodash';

import { fetchPostData } from '_utils/FetchPostData';

import { MySnackberContext } from '_components/MySnackbarContext';
import { Spinner } from '_components/Spinner';
import { MyDialog } from '_components/MyDialog';

import { DeleteConfirmDialog } from './DeleteConfirmDialog';
import { DataInputs as RoleInputs } from './role/DataInputs';
import { DataInputs as LocationInputs } from './location/DataInputs';
import { DataInputs as CategoryInputs } from './category/DataInputs';
import { DataInputs as RoomInputs } from './room/DataInputs';

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

export type Mastertype = 'role' | 'location' | 'category' | 'room';

type InputMode = { mode: 'ins' | 'upd' | 'del' };
export type Inputs<RowData> = InputMode & RowData;

export type DefaultValuesType<RowData> = UnpackNestedValue<DeepPartial<Inputs<RowData>>>;

// react-hook-formのsetValue。型定義が長いのでショートカット用
type RHFSetValueP1<RowData> = Path<Inputs<RowData>>;
type RHFSetValueP2<RowData> = UnpackNestedValue<PathValue<Inputs<RowData>, Path<Inputs<RowData>>>>;

type RowDataInputDialogProps<RowData> = {
  master: Mastertype;
  defaultValues: DefaultValuesType<RowData>;
  open: boolean;
  onClose: () => void;
  data: RowData | null;
  reload: () => void;
};

export function RowDataInputDialog<RowData>(props: RowDataInputDialogProps<RowData>) {
  const { master, defaultValues, open, onClose, data, reload } = props;

  const { t } = useTranslation();
  const classes = useStyles();
  const snackberContext = useContext(MySnackberContext); // スナックバー取得用

  // 削除確認メッセージの状態
  const [delConfOpen, setDelConfOpen] = useState(false);

  // 入力フォームの登録
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    setError,
    formState: { errors, isDirty, isSubmitting, dirtyFields },
  } = useForm({ defaultValues });

  // 入力フォームの初期化
  useEffect(() => {
    if (open && !!data) {
      const values = Object.keys(defaultValues).reduce((newObj: FieldValues, key) => {
        if (key === 'mode') {
          newObj['mode'] = 'upd';
        } else {
          newObj[key] = (data as FieldValues)[key];
        }
        return newObj;
      }, {});
      reset(_.cloneDeep(values as DefaultValuesType<RowData>));
    } else {
      reset(_.cloneDeep(defaultValues));
    }
  }, [data, defaultValues, open, reset]);

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
    setValue('mode' as RHFSetValueP1<RowData>, 'del' as RHFSetValueP2<RowData>);
    handleSubmit(onSubmit)();
  };

  // データ送信submit
  const onSubmit: SubmitHandler<Inputs<RowData>> = async (formData) => {
    try {
      let url = '';
      switch (formData.mode) {
        case 'ins':
          url = `/${master}/create`;
          break;
        case 'upd':
          url = `/${master}/update`;
          break;
        case 'del':
          url = `/${master}/delete`;
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
            let name = key as keyof Inputs<RowData> as Path<Inputs<RowData>>;
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
              {master === 'role' && <RoleInputs control={control} errors={errors} />}
              {master === 'location' && <LocationInputs control={control} errors={errors} />}
              {master === 'category' && <CategoryInputs control={control} errors={errors} />}
              {master === 'room' && <RoomInputs control={control} errors={errors} />}
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
