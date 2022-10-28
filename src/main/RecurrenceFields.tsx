import { MouseEventHandler, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import _ from 'lodash';

import {
  Box,
  Button,
  Checkbox,
  createStyles,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  Grid,
  IconButton,
  makeStyles,
  MenuItem,
  TextField,
  Typography,
} from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

import CloseIcon from '@material-ui/icons/Close';
import LoopIcon from '@material-ui/icons/Loop';

import { UseFormGetValues, UseFormSetValue } from 'react-hook-form';

import { Inputs } from './RowDataInputDialog';

import {
  DayOfWeek,
  nameOfDayOfWeek,
  nameOfRecurrencePatternType,
  nameOfRecurrenceRangeType,
  nameOfWeekIndex,
  PatternedRecurrenceInput,
  RecurrencePattern,
  RecurrencePatternType,
  RecurrenceRange,
  RecurrenceRangeType,
  WeekIndex,
} from '_models/PatternedRecurrence';
import { addMonths, addYears, startOfDay } from 'date-fns';
import MyCalendar from '_components/MyCalendar';

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      margin: 0,
      padding: theme.spacing(1.5),
      paddingLeft: theme.spacing(2),
    },
    closeButton: {
      position: 'absolute',
      right: theme.spacing(0.75),
      top: theme.spacing(0.75),
      color: theme.palette.grey[500],
    },
    inputInterval: {
      width: 70,
    },
    inputDayOfMonth: {
      width: 70,
    },
    datePicker: {
      margin: 'auto 0',
    },
  })
);

type InitValuesType = {
  pattern: {
    type: RecurrencePatternType;
    interval: number;
    daysOfWeek: CheckBoxWeek;
    dayOfMonth: number;
    index: WeekIndex;
    month: number;
  };
  range: {
    type: RecurrenceRangeType;
    endDate: Date;
    numberOfOccurrences: number;
  };
};
type CheckBoxWeek = { [K in DayOfWeek]: boolean };

type InputErrorType = {
  pattern: {
    type: string[] | undefined;
    interval: string[] | undefined;
    daysOfWeek: string[] | undefined;
    dayOfMonth: string[] | undefined;
    index: string[] | undefined;
    month: string[] | undefined;
  };
  range: {
    type: string[] | undefined;
    endDate: string[] | undefined;
    numberOfOccurrences: string[] | undefined;
  };
};

const defaultCheckBoxWeek = nameOfDayOfWeek.reduce((newObj, week) => {
  newObj[week] = false;
  return newObj;
}, {} as CheckBoxWeek);

const endDateAddAmount = 3;
const maxRepeatYear = 5;

const getDefaultValues = (startTime: Date) => {
  return {
    pattern: {
      type: nameOfRecurrencePatternType[0] as RecurrencePatternType,
      interval: 1,
      daysOfWeek: _.cloneDeep(defaultCheckBoxWeek),
      dayOfMonth: 1,
      index: nameOfWeekIndex[0] as WeekIndex,
      month: 1,
    },
    range: {
      type: nameOfRecurrenceRangeType[0] as RecurrenceRangeType,
      endDate: addMonths(startOfDay(startTime), endDateAddAmount),
      numberOfOccurrences: 1,
    },
  } as InitValuesType;
};

const defaultInputError = {
  pattern: {
    type: undefined,
    interval: undefined,
    daysOfWeek: undefined,
    dayOfMonth: undefined,
    index: undefined,
    month: undefined,
  },
  range: {
    type: undefined,
    endDate: undefined,
    numberOfOccurrences: undefined,
  },
} as InputErrorType;

type RecurrenceFieldsProps = {
  activeRoomSelect: () => void;
  activeSearchButton: () => void;
  getValues: UseFormGetValues<Inputs>;
  setValue: UseFormSetValue<Inputs>;
  startTime: Date;
  validateDatTime: () => Promise<boolean>;
  dateTimePickerFields: JSX.Element;
};

export function RecurrenceFields(props: RecurrenceFieldsProps) {
  const { activeRoomSelect, activeSearchButton, getValues, setValue, startTime, validateDatTime, dateTimePickerFields } = props;

  const { t } = useTranslation();
  const classes = useStyles();

  // 定期パターン文章
  const [patternInfo, setPatternInfo] = useState('');

  //ダイアログの状態
  const [open, setOpen] = useState(false);

  // 入力値の状態
  const [inputValues, setInputValues] = useState<InitValuesType>(_.cloneDeep(getDefaultValues(startTime)));
  // エラー値の状態
  const [errMsg, setErrMsg] = useState<InputErrorType>(_.cloneDeep(defaultInputError));

  // 初期値設定
  useEffect(() => {
    const defaultValues = { ...getDefaultValues(startTime) };
    if (open) {
      if (!!getValues('recurrence')) {
        // recurrenceオブジェクトから取得
        setInputValues({
          pattern: {
            type: getValues('recurrence')!.pattern.type,
            interval: getValues('recurrence')!.pattern.interval,
            daysOfWeek:
              !!getValues('recurrence')!.pattern.daysOfWeek && getValues('recurrence')!.pattern.daysOfWeek!.length > 0
                ? nameOfDayOfWeek.reduce((newObj, week) => {
                    newObj[week] = getValues('recurrence')!.pattern.daysOfWeek!.filter((value) => value === week).length > 0;
                    return newObj;
                  }, {} as CheckBoxWeek)
                : defaultValues.pattern.daysOfWeek,
            dayOfMonth: (!!getValues('recurrence')!.pattern.dayOfMonth
              ? getValues('recurrence')!.pattern.dayOfMonth
              : defaultValues.pattern.dayOfMonth) as number,
            index: (!!getValues('recurrence')!.pattern.index ? getValues('recurrence')!.pattern.index : defaultValues.pattern.index) as WeekIndex,
            month: (!!getValues('recurrence')!.pattern.month ? getValues('recurrence')!.pattern.month : defaultValues.pattern.month) as number,
          },
          range: {
            type: getValues('recurrence')!.range.type,
            endDate: getValues('recurrence')!.range.endDate ? new Date(getValues('recurrence')!.range.endDate!) : defaultValues.range.endDate,
            numberOfOccurrences: getValues('recurrence')!.range.numberOfOccurrences
              ? getValues('recurrence')!.range.numberOfOccurrences!
              : defaultValues.range.numberOfOccurrences,
          },
        });
      } else {
        setInputValues(_.cloneDeep(defaultValues));
      }
    } else {
      setInputValues(_.cloneDeep(defaultValues));
    }
    setErrMsg(_.cloneDeep(defaultInputError));
  }, [getValues, open, startTime]);

  // ダイアログを閉じたとき、定期パターンの内容を文章化
  useEffect(() => {
    if (!open) {
      if (!!getValues('recurrence')) {
        setPatternInfo(getValues('recurrence')?.pattern.type as string); //TODO:とりま
      } else {
        setPatternInfo('');
      }
    }
  }, [getValues, open]);

  // 開始日変更に伴う終了日変更
  useEffect(() => {
    setInputValues((values) => {
      return { ...values, range: { ...values.range, endDate: addMonths(startOfDay(startTime), endDateAddAmount) } };
    });
  }, [startTime]);

  // dialogOpen
  const handleOpen = () => {
    setOpen(true);
  };
  // dialogClose
  const handleClose = (_event: MouseEventHandler, reason: string) => {
    if (reason && reason === 'backdropClick') return;
    handleCancel();
  };

  // OKアクション
  const handleOk = async () => {
    // 入力チェック
    let isError = false;
    const errorMsg = _.cloneDeep(defaultInputError);

    const start = startOfDay(startTime);
    const end = startOfDay(inputValues.range.endDate);
    const maxEnd = addYears(start, maxRepeatYear);

    if (start.getTime() > end.getTime()) {
      //日にちの大小関係エラー
      errorMsg.range.endDate = [`${t('recurrence-dialog.error.range.end-date')}`];
      isError = true;
    } else if (!(await validateDatTime())) {
      //時刻の大小関係エラー
      isError = true;
    } else if (maxEnd.getTime() < end.getTime()) {
      //最長予約年数チェック
      errorMsg.range.endDate = [`${t('recurrence-dialog.error.range.date.max')}`];
      isError = true;
    }
    setErrMsg(errorMsg);

    if (isError) return;

    // 曜日チェックボックスの値をRecurrenceオブジェクト用に加工する
    const daysOfWeek = Object.keys(inputValues.pattern.daysOfWeek).filter((week) => inputValues.pattern.daysOfWeek[week as DayOfWeek]) as DayOfWeek[];

    let pattern = { type: inputValues.pattern.type, interval: inputValues.pattern.interval } as RecurrencePattern;
    switch (inputValues.pattern.type) {
      case 'daily':
        break;
      case 'weekly':
        pattern.daysOfWeek = daysOfWeek;
        break;
      case 'absoluteMonthly':
        pattern.dayOfMonth = inputValues.pattern.dayOfMonth;
        break;
      case 'relativeMonthly':
        pattern.daysOfWeek = daysOfWeek;
        pattern.index = inputValues.pattern.index;
        break;
      case 'absoluteYearly':
        pattern.dayOfMonth = inputValues.pattern.dayOfMonth;
        pattern.index = inputValues.pattern.index;
        pattern.month = inputValues.pattern.month;
        break;
      case 'relativeYearly':
        pattern.daysOfWeek = daysOfWeek;
        pattern.index = inputValues.pattern.index;
        pattern.month = inputValues.pattern.month;
        break;
      default:
        break;
    }
    let range = { type: inputValues.range.type } as RecurrenceRange;
    switch (inputValues.range.type) {
      case 'endDate':
        range.endDate = inputValues.range.endDate;
        break;
      // case 'noEnd'://TODO: noEnd未対応（最大５年問題）
      //   break;
      case 'numbered':
        range.numberOfOccurrences = inputValues.range.numberOfOccurrences;
        break;
      default:
        break;
    }
    setValue('recurrence', { pattern: pattern, range: range } as PatternedRecurrenceInput, { shouldDirty: true });

    activeRoomSelect();
    setOpen(false);
  };

  // Cancelアクション
  const handleCancel = () => {
    setOpen(false);
  };

  // 解除アクション
  const handleRelease = () => {
    setValue('recurrence', undefined, { shouldDirty: true });
    activeSearchButton();
    setOpen(false);
  };

  const patternTypeList = nameOfRecurrencePatternType.map((value) => {
    return { label: t(`recurrence-dialog.pattern.type.${value}`), value: value };
  });
  const dayOfWeekList = nameOfDayOfWeek.map((value) => {
    return { label: t(`recurrence-dialog.pattern.day-of-week.${value}`), value: value };
  });
  const weekIndexList = nameOfWeekIndex.map((value) => {
    return { label: t(`recurrence-dialog.pattern.index.${value}`), value: value };
  });
  const monthList = [...Array(12)]
    .map((_, i) => i + 1)
    .map((value) => {
      return { label: t(`recurrence-dialog.pattern.month.${value}`), value: value };
    });

  // 曜日チェックボックス
  const WeekCheckBox = useMemo(() => {
    return (
      <FormGroup row>
        {nameOfDayOfWeek.map((week, index) => {
          return (
            <FormControlLabel
              key={index}
              control={
                <Checkbox
                  checked={inputValues.pattern.daysOfWeek[week]}
                  onChange={(e) => {
                    setInputValues((values) => {
                      return {
                        ...values,
                        pattern: {
                          ...values.pattern,
                          daysOfWeek: { ...values.pattern.daysOfWeek, [e.target.name as DayOfWeek]: e.target.checked },
                        },
                      };
                    });
                  }}
                  name={week}
                  color="primary"
                />
              }
              label={t(`recurrence-dialog.pattern.day-of-week.${week}`)}
            />
          );
        })}
      </FormGroup>
    );
  }, [inputValues, t]);

  // 曜日セレクトボックス
  const WeekSelectBox = useMemo(() => {
    return (
      <TextField
        label={t('recurrence-dialog.header.pattern.days-of-week')}
        select={true}
        value={
          Object.keys(inputValues.pattern.daysOfWeek).filter((week) => inputValues.pattern.daysOfWeek[week as DayOfWeek]).length > 0
            ? Object.keys(inputValues.pattern.daysOfWeek).filter((week) => inputValues.pattern.daysOfWeek[week as DayOfWeek])
            : nameOfDayOfWeek[0]
        }
        onChange={(e) => {
          const value = _.cloneDeep(defaultCheckBoxWeek);
          value[e.target.value as DayOfWeek] = true;
          setInputValues((values) => {
            return { ...values, pattern: { ...values.pattern, daysOfWeek: _.cloneDeep(value) } };
          });
        }}
        error={!!errMsg.pattern.daysOfWeek}
        helperText={errMsg.pattern.daysOfWeek}
      >
        {dayOfWeekList.map((option, index) => (
          <MenuItem key={index} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>
    );
  }, [dayOfWeekList, errMsg.pattern.daysOfWeek, inputValues, t]);

  // 週数セレクトボックス
  const IndexSelectBox = useMemo(() => {
    return (
      <TextField
        label={t('recurrence-dialog.header.pattern.index')}
        select={true}
        value={inputValues.pattern.index}
        onChange={(e) => {
          setInputValues((values) => {
            return { ...values, pattern: { ...values.pattern, index: e.target.value as WeekIndex } };
          });
        }}
        error={!!errMsg.pattern.index}
        helperText={errMsg.pattern.index}
      >
        {weekIndexList.map((option, index) => (
          <MenuItem key={index} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>
    );
  }, [errMsg.pattern.index, inputValues, t, weekIndexList]);

  // 日付インプットフィールド
  const DayOfMonthText = useMemo(() => {
    return (
      <TextField
        className={classes.inputDayOfMonth}
        label={t('recurrence-dialog.header.pattern.day-of-month')}
        type="number"
        inputProps={{ min: 1, style: { textAlign: 'right' } }}
        value={inputValues.pattern.dayOfMonth}
        onChange={(e) => {
          setInputValues((values) => {
            return { ...values, pattern: { ...values.pattern, dayOfMonth: Number(e.target.value) } };
          });
        }}
        error={!!errMsg.pattern.dayOfMonth}
        helperText={errMsg.pattern.dayOfMonth}
      ></TextField>
    );
  }, [classes.inputDayOfMonth, errMsg.pattern.dayOfMonth, inputValues, t]);

  // 月セレクトボックス
  const MonthSelectBox = useMemo(() => {
    return (
      <TextField
        label={t('recurrence-dialog.header.pattern.month')}
        select={true}
        value={inputValues.pattern.month}
        onChange={(e) => {
          setInputValues((values) => {
            return { ...values, pattern: { ...values.pattern, month: Number(e.target.value) } };
          });
        }}
        error={!!errMsg.pattern.month}
        helperText={errMsg.pattern.month}
      >
        {monthList.map((option, index) => (
          <MenuItem key={index} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>
    );
  }, [errMsg.pattern.month, inputValues, t, monthList]);

  return (
    <>
      {!getValues('recurrence') && (
        <Button size="small" color="primary" startIcon={<LoopIcon />} onClick={handleOpen}>
          {t('visitdialog.button.set-recurrence')}
        </Button>
      )}
      {!!getValues('recurrence') && (
        <>
          <TextField label={t('visitdialog.notes.recurrence-info')} value={patternInfo} disabled></TextField>
          <Button size="small" color="primary" startIcon={<LoopIcon />} onClick={handleOpen}>
            {t('visitdialog.button.edit-recurrence')}
          </Button>
        </>
      )}

      <Dialog open={open} onClose={handleClose} fullWidth={true} maxWidth="sm" aria-labelledby="form-dialog-title">
        <DialogTitle className={classes.root}>
          {t('recurrence-dialog.title')}
          <IconButton className={classes.closeButton} onClick={handleCancel}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Box px={2} py={1}>
            {dateTimePickerFields}
          </Box>

          <Divider />

          <Box px={2} py={1}>
            <TextField
              label={t('recurrence-dialog.header.pattern.type')}
              select={true}
              value={inputValues.pattern.type}
              onChange={(e) => {
                const defaultValues = { ...getDefaultValues(startTime) };
                defaultValues.pattern.type = e.target.value as RecurrencePatternType;
                setInputValues((values) => {
                  return { ...values, pattern: { ...defaultValues.pattern } }; // patternの中身は全置換え(リセット)
                });
              }}
              error={!!errMsg.pattern.type}
              helperText={errMsg.pattern.type}
            >
              {patternTypeList.map((option, index) => (
                <MenuItem key={index} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>

            <Grid container>
              <Grid item xs={12} md={4} container spacing={1} alignItems="center">
                <Grid item>
                  <TextField
                    className={classes.inputInterval}
                    label={t('recurrence-dialog.header.pattern.interval')}
                    type="number"
                    inputProps={{ min: 1, style: { textAlign: 'right' } }}
                    value={inputValues.pattern.interval}
                    onChange={(e) => {
                      setInputValues((values) => {
                        return { ...values, pattern: { ...values.pattern, interval: Number(e.target.value) } };
                      });
                    }}
                    error={!!errMsg.pattern.interval}
                    helperText={errMsg.pattern.interval}
                  />
                </Grid>
                <Grid item>
                  <Typography>{t(`recurrence-dialog.label.pattern.interval.${inputValues.pattern.type}`)}</Typography>
                </Grid>
              </Grid>

              <Grid item style={inputValues.pattern.type === 'weekly' ? undefined : { display: 'none' }}>
                <FormControl error={!!errMsg.pattern.daysOfWeek}>
                  {WeekCheckBox}
                  {!!errMsg.pattern.daysOfWeek && <FormHelperText error>{errMsg.pattern.daysOfWeek}</FormHelperText>}
                </FormControl>
              </Grid>

              <Grid item style={inputValues.pattern.type === 'absoluteMonthly' ? undefined : { display: 'none' }}>
                <Grid item container spacing={1} alignItems="center">
                  <Grid item>{DayOfMonthText}</Grid>
                  <Grid item>
                    <Typography>{t(`recurrence-dialog.label.pattern.day-of-month.absolute`)}</Typography>
                  </Grid>
                </Grid>
              </Grid>

              <Grid item style={inputValues.pattern.type === 'relativeMonthly' ? undefined : { display: 'none' }}>
                <Grid item container spacing={1} alignItems="center">
                  <Grid item>{IndexSelectBox}</Grid>
                  <Grid item>{WeekSelectBox}</Grid>
                  <Grid item>
                    <Typography>{t(`recurrence-dialog.label.pattern.day-of-month.relative`)}</Typography>
                  </Grid>
                </Grid>
              </Grid>

              <Grid item style={inputValues.pattern.type === 'absoluteYearly' ? undefined : { display: 'none' }}>
                <Grid item container spacing={1} alignItems="center">
                  <Grid item>{MonthSelectBox}</Grid>
                  <Grid item>{DayOfMonthText}</Grid>
                  <Grid item>
                    <Typography>{t(`recurrence-dialog.label.pattern.day-of-month.absolute`)}</Typography>
                  </Grid>
                </Grid>
              </Grid>

              <Grid item style={inputValues.pattern.type === 'relativeYearly' ? undefined : { display: 'none' }}>
                <Grid item container spacing={1} alignItems="center">
                  <Grid item>{MonthSelectBox}</Grid>
                  <Grid item>{IndexSelectBox}</Grid>
                  <Grid item>{WeekSelectBox}</Grid>
                  <Grid item>
                    <Typography>{t(`recurrence-dialog.label.pattern.day-of-month.relative`)}</Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Box>

          <Divider />

          <Box px={2} py={1}>
            <Grid container spacing={2}>
              <Grid item className={classes.datePicker}>
                <MyCalendar
                  label={t('recurrence-dialog.header.range.end-date')}
                  date={inputValues.range.endDate}
                  disablePast={true}
                  onChange={(e) => {
                    if (!e) return;
                    setInputValues((values) => {
                      return { ...values, range: { ...values.range, endDate: e } };
                    });
                  }}
                  error={!!errMsg.range.endDate}
                />
              </Grid>
            </Grid>
            {!!errMsg.range.endDate && <FormHelperText error>{errMsg.range.endDate}</FormHelperText>}
          </Box>

          <Box p={2}>
            <Grid container justifyContent="space-between" spacing={2}>
              <Grid item xs={4}>
                <Button variant="contained" color="secondary" fullWidth onClick={handleOk}>
                  {t('common.button.ok')}
                </Button>
              </Grid>
              <Grid item xs={4}>
                <Button variant="contained" color="secondary" fullWidth onClick={handleCancel}>
                  {t('common.button.cancel')}
                </Button>
              </Grid>
              <Grid item xs={4}>
                <Button variant="contained" color="secondary" fullWidth onClick={handleRelease} disabled={getValues('recurrence') === undefined}>
                  {t('visitdialog.button.release-recurrence')}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
}
