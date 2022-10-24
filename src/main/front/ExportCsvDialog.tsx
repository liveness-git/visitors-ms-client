import { useContext, useState, useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useRouteMatch } from 'react-router-dom';
import { addWeeks, format, startOfDay } from 'date-fns';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { CSVLink } from 'react-csv';
import _ from 'lodash';

import { Box, Button, Grid, makeStyles } from '@material-ui/core';
import { KeyboardDatePicker } from '@material-ui/pickers';
import ArrowRightAltIcon from '@material-ui/icons/ArrowRightAlt';

import { MyDialog } from '_components/MyDialog';
import { MySnackberContext } from '_components/MySnackbarContext';
import { Spinner } from '_components/Spinner';

import { fetchPostData } from '_utils/FetchPostData';
import { LocationParams } from '_models/Location';
import { VisitorInfo, VisitorInfoFront, VisitorInfoReadOnly } from '_models/VisitorInfo';

const useStyles = makeStyles({
  keyboardDatePicker: {
    '& .MuiOutlinedInput-adornedEnd': { paddingRight: 0 },
  },
  between: { textAlign: 'center' },
});

type ExportCsvParams = {
  location: string;
  startDate: Date;
  endDate: Date;
};

type DataType = VisitorInfo & VisitorInfoReadOnly & VisitorInfoFront;

const nameOfCsvHeaders = [
  'apptTime',
  'roomName',
  'teaSupply',
  'numberOfTeaSupply',
  'numberOfVisitor',
  'numberOfEmployee',
  'visitCompany',
  'visitorName',
  'checkIn',
  'visitorCardNumber',
  'checkOut',
  'reservationName',
  'contactAddr',
  'subject',
  'comment',
] as const;
type TypeOfCsvHeaders = typeof nameOfCsvHeaders[number];
type CsvDataType = {
  [P in TypeOfCsvHeaders]: string;
};
type CsvHeaderType = { label: string; key: keyof CsvDataType };

type ExportCsvDialogProps = {
  open: boolean;
  onClose: () => void;
};

export function ExportCsvDialog(props: ExportCsvDialogProps) {
  const { open, onClose } = props;

  const { t } = useTranslation();
  const classes = useStyles();
  const match = useRouteMatch<LocationParams>();
  const snackberContext = useContext(MySnackberContext); // スナックバー取得用

  const csvLinkRef = useRef<CSVLink & HTMLAnchorElement & { link: HTMLAnchorElement }>(null);

  // CSVデータの状態
  const [csvData, setCsvData] = useState<CsvDataType[]>([]);

  // 入力フォームの登録
  const defaultValues = useMemo(() => {
    return { location: match.params.location, startDate: new Date(), endDate: addWeeks(new Date(), 1) };
  }, [match.params.location]);

  const {
    control,
    getValues,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting, dirtyFields },
  } = useForm<ExportCsvParams>({ defaultValues, reValidateMode: 'onSubmit' });

  // 入力フォームの初期化
  useEffect(() => {
    if (open) {
      reset(defaultValues);
    }
  }, [defaultValues, open, reset]);

  // 開始日の変更アクション
  const handleStartDateChange = () => {
    const endDate = addWeeks(getValues('startDate'), 1);
    setValue('endDate', endDate, { shouldDirty: true });
  };

  // CSV出力アクション
  const handleExportCsv = async () => {
    handleSubmit(onSubmit)();
  };

  // CSVヘッダー
  const headers: CsvHeaderType[] = nameOfCsvHeaders.map((value) => {
    return { label: t(`export-csv.file.header.${_.kebabCase(value)}`), key: value };
  });

  // CSVファイル名
  const filename = `visitor-${format(getValues('startDate'), 'yyyyMMdd')}-${format(getValues('endDate'), 'yyyyMMdd')}.csv`;

  // データ送信submit
  const onSubmit: SubmitHandler<ExportCsvParams> = async (formData) => {
    try {
      const result = await fetchPostData<ExportCsvParams, ExportCsvParams, DataType[]>('/front/export', {
        inputs: formData,
        dirtyFields: dirtyFields,
      });
      if (result!.success) {
        if (!!result.value) {
          const data = result.value.map((item) => {
            const roomId = Object.keys(item.resourcies)[0]; // TODO:複数会議室未対応
            return {
              apptTime: item.apptTime,
              roomName: item.roomName,
              teaSupply: item.resourcies[roomId].teaSupply ? t('export-csv.file.tea-supply-yes') : t('export-csv.file.tea-supply-no'),
              numberOfTeaSupply: item.resourcies[roomId].numberOfTeaSupply.toString(),
              numberOfVisitor: item.numberOfVisitor.toString(),
              numberOfEmployee: item.numberOfEmployee.toString(),
              visitCompany: item.visitCompany,
              visitorName: item.visitorName,
              checkIn: item.checkIn,
              visitorCardNumber: item.visitorCardNumber,
              checkOut: item.checkOut,
              reservationName: item.reservationName,
              contactAddr: item.contactAddr,
              subject: item.subject,
              comment: item.comment,
            };
          }) as CsvDataType[];
          setCsvData(data);
          csvLinkRef?.current?.link.click();
          snackberContext.dispatch({ type: 'success', message: t('export-csv.msg.export-success') });
        }
      } else {
        // エラーのセット
        snackberContext.dispatch({ type: 'error', message: t('export-csv.msg.export-failed') });
      }
    } catch (error) {
      snackberContext.dispatch({ type: 'error', message: (error as Error).message });
    }
  };

  // 日付ピッカー
  const datePicker = (type: 'start' | 'end') => (
    <Controller
      name={`${type}Date`}
      control={control}
      rules={{
        required: t('common.form.required') as string,
        validate: () =>
          startOfDay(getValues('startDate')).getTime() <= startOfDay(getValues('endDate')).getTime() ||
          (t('export-csv.form.error.event-time') as string),
      }}
      render={({ field }) => (
        <KeyboardDatePicker
          {...field}
          onChange={(e) => {
            field.onChange(e);
            if (type === 'start') handleStartDateChange();
          }}
          format="yyyy/MM/dd"
          label={t(`export-csv.${type}-date`)}
          showTodayButton
          KeyboardButtonProps={{
            'aria-label': 'change date',
          }}
          size="small"
          className={classes.keyboardDatePicker}
          error={!!errors[`${type}Date`]}
          helperText={errors[`${type}Date`] && errors[`${type}Date`]!.message}
        />
      )}
    />
  );

  return (
    <>
      <Spinner open={isSubmitting} />
      <MyDialog open={open} onClose={onClose} title={t('export-csv.title')}>
        <form>
          <Box px={2} pt={2}>
            <Grid container justifyContent="center" alignItems="center">
              <Grid container item xs={12} sm={4}>
                {datePicker('start')}
              </Grid>
              <Grid item xs={12} sm={4} className={classes.between}>
                <ArrowRightAltIcon />
              </Grid>
              <Grid container item xs={12} sm={4}>
                {datePicker('end')}
              </Grid>
            </Grid>
          </Box>
          <Box p={2}>
            <Button onClick={handleExportCsv} variant="contained" color="primary" fullWidth>
              {t('export-csv.button.export-csv')}
            </Button>
          </Box>
        </form>

        <CSVLink style={{ display: 'none' }} data={csvData} headers={headers} filename={filename} ref={csvLinkRef}>
          {'Export Trigger'}
        </CSVLink>
      </MyDialog>
    </>
  );
}
