import { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DeepPartial, Path, PathValue, SubmitHandler, UnpackNestedValue, useForm, FieldValues, FormProvider } from 'react-hook-form';

import { Box, Grid, Button } from '@material-ui/core';
import { makeStyles, createStyles, createTheme, ThemeProvider } from '@material-ui/core/styles';
import { grey } from '@material-ui/core/colors';

import DeleteIcon from '@material-ui/icons/Delete';
import SaveIcon from '@material-ui/icons/Save';

import _ from 'lodash';

import { defaultPrimary } from '_styles/Theme';
import { fetchPostData } from '_utils/FetchPostData';

import { MySnackberContext } from '_components/MySnackbarContext';
import { Spinner } from '_components/Spinner';
import { MyDialog } from '_components/MyDialog';
import { MyConfirmDialog } from '_components/MyConfirmDialog';

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
      main: defaultPrimary.main,
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

type DefaultValuesType<RowData> = UnpackNestedValue<DeepPartial<Inputs<RowData>>>;
export type InputFields<RowData> = {
  type: Mastertype;
  item: React.ReactNode;
  defaultValues: DefaultValuesType<RowData>;
};

// react-hook-formのsetValue。型定義が長いのでショートカット用
type RHFSetValueP1<RowData> = Path<Inputs<RowData>>;
type RHFSetValueP2<RowData> = UnpackNestedValue<PathValue<Inputs<RowData>, Path<Inputs<RowData>>>>;

type RowDataInputDialogProps<RowData> = {
  inputFields: InputFields<RowData>;
  open: boolean;
  onClose: () => void;
  data: RowData | null;
  reload: () => void;
};

export function RowDataInputDialog<RowData>(props: RowDataInputDialogProps<RowData>) {
  const { inputFields, open, onClose, data, reload } = props;

  const { t } = useTranslation();
  const classes = useStyles();
  const snackberContext = useContext(MySnackberContext); // スナックバー取得用

  // 削除確認メッセージの状
  const [delConfOpen, setDelConfOpen] = useState(false);

  // 入力フォームの登録
  const methods = useForm({ defaultValues: { ...inputFields.defaultValues }, reValidateMode: 'onSubmit' });

  const {
    handleSubmit,
    reset,
    setValue,
    setError,
    formState: { isDirty, isSubmitting, dirtyFields },
  } = methods;

  // 入力フォームの初期化
  useEffect(() => {
    if (open && !!data) {
      const values = Object.keys(inputFields.defaultValues).reduce((newObj: FieldValues, key) => {
        if (key === 'mode') {
          newObj['mode'] = 'upd';
        } else {
          newObj[key] = (data as FieldValues)[key];
        }
        return newObj;
      }, {});
      reset(_.cloneDeep(values as DefaultValuesType<RowData>));
    } else {
      reset(_.cloneDeep(inputFields.defaultValues));
    }
  }, [data, inputFields, open, reset]);

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
          url = `/${inputFields.type}/create`;
          break;
        case 'upd':
          url = `/${inputFields.type}/update`;
          break;
        case 'del':
          url = `/${inputFields.type}/delete`;
          break;
      }
      const result = await fetchPostData(url, { inputs: formData, dirtyFields: dirtyFields });
      if (result!.success) {
        if (formData.mode === 'del') await new Promise((r) => setTimeout(r, 1000)); // MSGraphのイベント削除が反映されるまでのタイムラグを考慮
        await reload();
        onClose();
        snackberContext.dispatch({ type: 'success', message: t('common.msg.update-success') });
        // ロール設定とロケーション設定は更新反映のためにログアウトを促す
        if (inputFields.type === 'role' || inputFields.type === 'location') {
          await new Promise(() =>
            setTimeout(() => {
              snackberContext.dispatch({ type: 'warning', message: t('common.msg.prompt-logout') });
            }, 1500)
          );
        }
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
      <MyDialog open={open} onClose={onClose} title={t(`settings.title.${inputFields.type}`)}>
        <ThemeProvider theme={inputformTheme}>
          <FormProvider {...methods}>
            <form>
              <Box p={2}>{inputFields.item}</Box>
              <Box px={2}>
                <Grid container justifyContent="space-between" spacing={2} className={classes.formAction}>
                  <Grid item xs={!data ? 12 : 6}>
                    <Button onClick={handleSave} variant="contained" color="primary" disabled={!isDirty} startIcon={<SaveIcon />} fullWidth>
                      {t('common.button.save')}
                    </Button>
                  </Grid>
                  <Grid item xs={6} style={!data ? { display: 'none' } : undefined}>
                    <Button onClick={handleDelete} variant="contained" color="primary" /*disabled={!data}*/ startIcon={<DeleteIcon />} fullWidth>
                      {t('common.button.delete')}
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </form>
          </FormProvider>
        </ThemeProvider>
      </MyDialog>
      <MyConfirmDialog open={delConfOpen} onClose={handleDelConfClose} message={t('common.msg.delete-confirm')}></MyConfirmDialog>
    </>
  );
}
