import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useRouteMatch } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Controller, SubmitHandler, useFieldArray, useForm, useWatch } from 'react-hook-form';

import { Box, Grid, Button, List, Typography, TextField } from '@material-ui/core';
import { makeStyles, createStyles, createTheme, ThemeProvider } from '@material-ui/core/styles';
import { grey } from '@material-ui/core/colors';

import DeleteIcon from '@material-ui/icons/Delete';
import SaveIcon from '@material-ui/icons/Save';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';

import _ from 'lodash';

import { VisitorInfo, EventInputType, RoomInputType } from '_models/VisitorInfo';
import { nameOfUsageRangeForVisitor, Room, UsageRangeForVisitor } from '_models/Room';
import { LocationParams } from '_models/Location';
import { PatternedRecurrenceInput } from '_models/PatternedRecurrence';
import { User } from '_models/User';

import { defaultPrimary } from '_styles/Theme';
import { tableTheme, makeTableDialogStyle } from '_styles/TableTheme';

import { fetchPostData } from '_utils/FetchPostData';
import { useLoadData } from '_utils/useLoadData';

import { MySnackberContext } from '_components/MySnackbarContext';
import { Spinner } from '_components/Spinner';
import { ControllerTextField } from '_components/ControllerTextField';
import { AddrBookAutoComplete } from '_components/AddrBookAutoComplete';
import { MyDialog } from '_components/MyDialog';
import { UserStatusIconNote } from '_components/UserStatusIconNote';
import { calcEndTimeFromStartTime, calcStartTime } from '_components/MyTimePicker';
import { SessionStrageContext } from '_components/BaseTemplate';
import { MyConfirmDialog } from '_components/MyConfirmDialog';

import { RowDataType } from './DataTableBase';
import { RoomInputFields } from './RoomInputFields';
import { RoomReadFields, strRoomStatus } from './RoomReadFields';
import { ControllerDateTimePicker } from './ControllerDateTimePicker';
import ReservationNameField from './ReservationNameField';
import { LastUpdatedField } from './LastUpdatedField';
import { RecurrenceFields } from './RecurrenceFields';
import { DateTimePickerFields } from './DateTimePickerFields';
import { VisitCompanyInputFields } from './VisitCompanyInputFields';
import { abortRequestSafe } from '_utils/Http';

const useRowDataDialogStyles = makeTableDialogStyle();

const useStyles = makeStyles((tableTheme) => {
  return createStyles({
    formAction: {
      marginTop: tableTheme.spacing(1),
      marginBottom: tableTheme.spacing(1),
    },
    note: {
      color: 'red',
      fontSize: '0.9em',
      marginTop: 0,
    },
    usageGuide: {
      marginTop: '5px',
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
      minRows: 2,
    },
  },
  overrides: {
    MuiOutlinedInput: {
      adornedEnd: {
        paddingRight: 0,
      },
    },
  },
});

export type Inputs = {
  mode: 'ins' | 'upd' | 'del';
} & VisitorInfo &
  EventInputType;

export const ADD_ROOM_KEY = 'add-room-01';

const FETCH_ROOMS_SELECT = 'FETCH_INPUT_DIALOG_ROOMS_SELECT';

export type AddDefaultType = {
  start: Date;
  roomId: string;
  usageRange: UsageRangeForVisitor;
};

// 入力フォームの初期値
const getDefaultValues = (user: User, start?: Date, roomId?: string, usage?: UsageRangeForVisitor) => {
  const startDate = start ? start : new Date();
  const room = roomId ? roomId : '';
  const usageRange = usage ? usage : 'outside';
  const contactAddr = !!user.contactAddr ? user.contactAddr : '';
  return {
    mode: 'ins',
    iCalUId: '',
    subject: '',
    visitorId: '',
    visitCompany: usageRange === 'outside' ? [{ name: '', rep: '' }] : [],
    numberOfVisitor: 0,
    numberOfEmployee: 0,
    mailto: { authors: [], required: [], optional: [] },
    usageRange: usageRange,
    resourcies: {
      [ADD_ROOM_KEY]: {
        roomForEdit: room,
        teaSupply: false,
        numberOfTeaSupply: 0,
        teaDetails: '',
      },
    },
    comment: '',
    contactAddr: contactAddr,
    startTime: calcStartTime(startDate),
    endTime: calcEndTimeFromStartTime(startDate),
    seriesMasterId: undefined,
    recurrence: undefined,
    reservationInfo: undefined,
  } as Inputs;
};

// useFieldArray使用により、dirtyFields内にfalseの場合もマークアップされるようになった為trueのみに絞り込む
const cloneDeepWithoutFalse = (obj: any) => {
  // falseを排除したdirtyFieldsを作成
  const withoutFalse = _.transform(obj, (result: any, value, key) => {
    if (value === false) return;
    result[key] = _.isObject(value) ? cloneDeepWithoutFalse(value) : value;
  });
  // ↑から空の配列やオブジェクトを排除
  return _.transform(withoutFalse, (result: any, value, key) => {
    if (value !== true && _.isEmpty(value)) return; // isEmptyにtrueが含まれるらしいので別途条件に追加
    result[key] = _.isObject(value) ? cloneDeepWithoutFalse(value) : value;
  });
};

type RowDataInputDialogProps = {
  open: boolean;
  onClose: () => void;
  data: RowDataType | null;
  reload: () => void;
  addDefault?: AddDefaultType;
};

export function RowDataInputDialog(props: RowDataInputDialogProps) {
  const { open, onClose, data, reload, addDefault } = props;

  const { t } = useTranslation();
  const classes = { ...useRowDataDialogStyles(), ...useStyles() };
  const snackberContext = useContext(MySnackberContext); // スナックバー取得用
  const sessionStrageContext = useContext(SessionStrageContext); // sessionStrage取得用
  const match = useRouteMatch<LocationParams>();

  // 削除確認メッセージの状態
  const [delConfOpen, setDelConfOpen] = useState(false);

  // 入力フォームの登録
  const defaultValues = useMemo(() => getDefaultValues(sessionStrageContext.userStorage), [sessionStrageContext.userStorage]);
  const {
    control,
    getValues,
    handleSubmit,
    reset,
    setValue,
    trigger,
    setError,
    clearErrors,
    formState: { errors, isDirty, isSubmitting, dirtyFields },
  } = useForm<Inputs>({ defaultValues, reValidateMode: 'onSubmit' });

  // 入力フォームの初期化
  useEffect(() => {
    if (open && !!data) {
      reset({
        mode: 'upd',
        iCalUId: data.iCalUId,
        subject: data.subject,
        visitorId: data.visitorId,
        visitCompany: data.visitCompany,
        numberOfVisitor: data.numberOfVisitor,
        numberOfEmployee: data.numberOfEmployee,
        mailto: data.mailto,
        usageRange: data.usageRange,
        resourcies: Object.keys(data.resourcies).reduce((newObj, room) => {
          newObj[room] = {
            roomForEdit: room,
            teaSupply: data.resourcies[room].teaSupply,
            numberOfTeaSupply: data.resourcies[room].numberOfTeaSupply,
            teaDetails: data.resourcies[room].teaDetails,
          };
          return newObj;
        }, {} as RoomInputType),
        comment: data.comment,
        contactAddr: data.contactAddr,
        startTime: new Date(data.startDateTime),
        endTime: new Date(data.endDateTime),
        seriesMasterId: data.seriesMasterId,
        recurrence: !!data.recurrence
          ? ({
              pattern: {
                type: data.recurrence.pattern.type,
                interval: data.recurrence.pattern.interval,
                daysOfWeek: data.recurrence.pattern.daysOfWeek,
                dayOfMonth: data.recurrence.pattern.dayOfMonth,
                index: data.recurrence.pattern.index,
                month: data.recurrence.pattern.month,
              },
              range: {
                type: data.recurrence.range.type,
                startDate: data.recurrence.range.startDate,
                endDate: data.recurrence.range.endDate,
              },
            } as PatternedRecurrenceInput)
          : undefined,
        reservationInfo: data.reservationInfo,
      });
    } else {
      reset(_.cloneDeep(getDefaultValues(sessionStrageContext.userStorage, addDefault?.start, addDefault?.roomId, addDefault?.usageRange)));
    }
  }, [data, open, reset, addDefault, sessionStrageContext.userStorage]);

  // ::空き会議室の制御関連 start -------------------------->
  // 会議室コンポーネントの表示状態
  const [hiddenRooms, setHiddenRooms] = useState(false);

  // 利用範囲選択を監視
  const usageRangeWatch = useWatch({ control, name: 'usageRange' });

  // 空き会議室一覧の取得
  const defaultRoomsUrl = `/room/choices?location=${match.params.location}`;
  const [{ data: rooms, isLoading: roomsLoading }, , setUrl] = useLoadData<Room[]>('', [], FETCH_ROOMS_SELECT);

  // 空き会議室一覧のURL更新
  const buildRoomsUrl = useCallback(() => {
    if (getValues('mode') === 'upd') {
      // 更新時、会議室変更は出来ないためデフォルト値
      setUrl(defaultRoomsUrl);
    } else if (!!getValues('recurrence')) {
      setUrl(defaultRoomsUrl + `&usagerange=${getValues('usageRange')}`);
    } else {
      setUrl(
        defaultRoomsUrl +
          `&start=${getValues('startTime').getTime()}&end=${getValues('endTime').getTime()}` +
          `&usagerange=${getValues('usageRange')}`
      );
    }
  }, [defaultRoomsUrl, getValues, setUrl]);

  // 空き会議室一覧のURLリセット
  useEffect(() => {
    if (open) {
      buildRoomsUrl();
    }
    return () => {
      abortRequestSafe(FETCH_ROOMS_SELECT, 'OPTIONAL_REASON'); // manual abort
    };
  }, [buildRoomsUrl, open, usageRangeWatch]); // 利用範囲変更時もリセット対象

  // 会議室コンポーネントの表示リセット
  useEffect(() => {
    if (!open) setHiddenRooms(false);
  }, [open]);

  // ::空き会議室の制御関連 end --------------------------<

  // 来訪情報の制御状態
  const [disabledVisitor, setDisabledVisitor] = useState(false);

  // 利用範囲のエフェクト（来訪情報の制御）
  useEffect(() => {
    // 社内会議
    if (usageRangeWatch === 'inside') {
      clearErrors(['visitCompany', 'numberOfVisitor']);
      setValue('visitCompany', [], { shouldDirty: true });
      setValue('numberOfVisitor', 0, { shouldDirty: true });
      setDisabledVisitor(true);
    } else {
      // 社外会議
      clearErrors('visitCompany');
      setValue('visitCompany', [{ name: '', rep: '' }], { shouldDirty: true });
      setDisabledVisitor(false);
    }
  }, [clearErrors, setValue, usageRangeWatch]);

  // 予約日時を監視
  const startTimeWatch = useWatch({ control, name: 'startTime' });
  const endTimeWatch = useWatch({ control, name: 'endTime' });

  // 来訪社/代表者フィールドの配列管理
  const { fields: visitCompanyFields, append: visitCompanyAppend, remove: visitCompanyRemove } = useFieldArray({ control, name: 'visitCompany' });
  const visitCompanyWatch = useWatch({ control, name: 'visitCompany' });

  // ::アクション処理 start-->

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
      const result = await fetchPostData(url, { inputs: formData, dirtyFields: cloneDeepWithoutFalse(dirtyFields) });
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

  // 検索ボタンアクション
  const handleSearch = async () => {
    const result = await trigger(['startTime', 'endTime']); //validate
    if (!result) return;
    buildRoomsUrl();
    setHiddenRooms(false);
  };

  // 検索ボタン活性化
  const activeSearchButton = () => {
    if (getValues('mode') === 'upd') return; // 更新時、会議室変更は出来ないため非対応
    if (!hiddenRooms) {
      setHiddenRooms(true);
    }
  };
  // 開始日時の変更アクション
  const handleStartTimeChange = () => {
    const endTime = calcEndTimeFromStartTime(getValues('startTime'));
    setValue('endTime', endTime, { shouldDirty: true });
    activeSearchButton();
  };
  // 終了日時の変更アクション
  const handleEndTimeChange = () => {
    activeSearchButton();
  };

  // 予約日の変更アクション(DateTimePicker用)
  const handleDateChange = (date: Date) => {
    setValue(
      'startTime',
      new Date(date.getFullYear(), date.getMonth(), date.getDate(), getValues('startTime').getHours(), getValues('startTime').getMinutes()),
      { shouldDirty: true }
    );
    handleStartTimeChange();
  };
  //  開始時間の変更アクション(DateTimePicker用)
  const handleStartChange = (date: Date) => {
    setValue('startTime', date, { shouldDirty: true });
    handleStartTimeChange();
  };
  //  終了時間の変更アクション(DateTimePicker用)
  const handleEndChange = (date: Date) => {
    setValue('endTime', date, { shouldDirty: true });
    handleEndTimeChange();
  };

  // 会議室選択活性化 (定期イベント用)
  const activeRoomSelect = () => {
    if (getValues('mode') === 'upd') return; // 更新時、会議室変更は出来ないため非対応
    setHiddenRooms(false);
    buildRoomsUrl();
  };

  // 来訪社追加アクション
  const appendVisitorCompany = () => {
    visitCompanyAppend({ name: '', rep: '' });
  };
  // 来訪社削除アクション
  const removeVisitorCompany = (index: number) => {
    visitCompanyRemove(index);
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
          {!!data && (
            <Box px={2}>
              <List disablePadding={true}>
                {(() => {
                  if (data.isMSMultipleLocations) {
                    /* mode=upd & 複数会議室 */
                    return (
                      <li className={classes.bottomLine}>
                        <p className={classes.note}>{t('visitdialog.notes.multiple-locations')}</p>
                      </li>
                    );
                  } else {
                    /* mode=upd & 単一会議室 */
                    return (
                      <li key="resource-status" className={classes.list}>
                        <div className={classes.title}>{t('visittable.header.resource-status')}</div>
                        <div className={classes.field}>{t(strRoomStatus(data.roomStatus))}</div>
                      </li>
                    );
                  }
                })()}
                <li key="reservation-name" className={classes.list}>
                  <div className={classes.title}>{t('visittable.header.reservation-name')}</div>
                  <div className={classes.field}>
                    <ReservationNameField name={data.reservationName} status={data.reservationStatus} />
                  </div>
                </li>
              </List>
            </Box>
          )}

          <form>
            <Box p={2} pb={0}>
              <ControllerTextField name="subject" control={control} label={t('visittable.header.event-subject')} required errors={errors} />

              {!!data && (
                <Typography variant="caption" display="block" className={classes.usageGuide}>
                  {t('visitdialog.notes.reply-status')}
                  <UserStatusIconNote />
                </Typography>
              )}

              <AddrBookAutoComplete
                name={'mailto.authors'}
                control={control}
                label={t('visittable.header.event-mailto-authors')}
                errors={errors}
                disabled={true}
                style={{ display: 'none' }}
              />
              <AddrBookAutoComplete
                name={'mailto.required'}
                control={control}
                label={t('visittable.header.event-mailto-required')}
                errors={errors}
                disabled={data?.isMSMultipleLocations}
              />
              <AddrBookAutoComplete
                name={'mailto.optional'}
                control={control}
                label={t('visittable.header.event-mailto-optional')}
                errors={errors}
                disabled={data?.isMSMultipleLocations}
              />

              <Box py={1} style={!!data ? { display: 'none' } : undefined}>
                <ControllerTextField
                  name={'usageRange'}
                  control={control}
                  label={t('visittable.header.usage-range')}
                  required
                  selectList={nameOfUsageRangeForVisitor.map((value) => {
                    return { label: t(`visitdialog.view.usage-range.${value}`), value: value };
                  })}
                  disabled={!!data}
                  errors={errors}
                />
              </Box>

              <Grid container spacing={1} style={!!getValues('recurrence') ? { display: 'none' } : undefined}>
                <Grid item xs={5} style={{ display: 'none' }}>
                  <ControllerDateTimePicker
                    name="startTime"
                    control={control}
                    getValues={getValues}
                    label={t('visittable.header.event-start-time')}
                    handleDateTimeChange={handleStartTimeChange}
                    errors={errors}
                  />
                </Grid>
                <Grid item xs={5} style={{ display: 'none' }}>
                  <ControllerDateTimePicker
                    name="endTime"
                    control={control}
                    getValues={getValues}
                    label={t('visittable.header.event-end-time')}
                    handleDateTimeChange={handleEndTimeChange}
                    errors={errors}
                  />
                </Grid>
                <Grid item xs={12} sm={10}>
                  <DateTimePickerFields
                    label={t('visittable.header.appt-date-time')}
                    start={startTimeWatch}
                    end={endTimeWatch}
                    onDateChange={handleDateChange}
                    onStartChange={handleStartChange}
                    onEndChange={handleEndChange}
                    disablePast={!data}
                    errMsg={errors['startTime']?.message ? [errors['startTime']?.message] : undefined}
                  ></DateTimePickerFields>
                </Grid>
                <Grid item xs={12} sm={2} style={{ margin: 'auto' }}>
                  <Button
                    onClick={handleSearch}
                    variant="contained"
                    color="primary"
                    fullWidth
                    disabled={data?.isMSMultipleLocations || !hiddenRooms}
                    style={getValues('mode') === 'upd' ? { display: 'none' } : undefined}
                  >
                    {t('common.button.search')}
                  </Button>
                </Grid>
              </Grid>

              {!data?.seriesMasterId && sessionStrageContext.userStorage.isFront && (
                <Grid>
                  <RecurrenceFields
                    activeRoomSelect={activeRoomSelect}
                    activeSearchButton={activeSearchButton}
                    getValues={getValues}
                    setValue={setValue}
                    clearErrors={clearErrors}
                    errors={errors}
                  ></RecurrenceFields>
                </Grid>
              )}
            </Box>

            {!data ? (
              /* 新規作成 */
              !hiddenRooms && (
                <RoomInputFields
                  control={control}
                  setValue={setValue}
                  getValues={getValues}
                  clearErrors={clearErrors}
                  rooms={rooms}
                  roomsLoading={roomsLoading}
                  roomId={ADD_ROOM_KEY}
                  disabledVisitor={disabledVisitor}
                  errors={errors}
                />
              )
            ) : (
              <>
                {!data.isMSMultipleLocations ? (
                  /* mode=upd & 単一会議室 */
                  !hiddenRooms && (
                    <RoomInputFields
                      control={control}
                      setValue={setValue}
                      getValues={getValues}
                      clearErrors={clearErrors}
                      rooms={rooms}
                      roomsLoading={roomsLoading}
                      roomId={Object.keys(data.resourcies)[0]}
                      disabledRoom={true}
                      disabledVisitor={data.usageRange === 'inside'}
                      errors={errors}
                    />
                  )
                ) : (
                  /* mode=upd & 複数会議室 */
                  <ThemeProvider theme={tableTheme}>
                    {Object.keys(data.resourcies).map((roomId) => {
                      return <RoomReadFields key={roomId} data={data.resourcies[roomId]} /*hiddenTeaSupply={true}*/ />;
                    })}
                  </ThemeProvider>
                )}
              </>
            )}

            <Box px={2} pt={1} style={disabledVisitor ? { display: 'none' } : undefined}>
              {visitCompanyFields.map((field, index) => (
                <VisitCompanyInputFields
                  key={field.id}
                  control={control}
                  index={index}
                  remove={removeVisitorCompany}
                  disabledVisitor={disabledVisitor}
                  errors={errors}
                />
              ))}
            </Box>

            <Box px={2}>
              <Grid container spacing={1}>
                <Grid item xs={12} sm={4} style={disabledVisitor ? { opacity: 0 } : { margin: 'auto' }}>
                  <Button
                    onClick={appendVisitorCompany}
                    startIcon={<AddCircleOutlineIcon />}
                    variant="contained"
                    color="primary"
                    fullWidth
                    disabled={visitCompanyWatch.length > 2} // 最大３社まで
                  >
                    {t('visitdialog.button.add-visitor')}
                  </Button>
                </Grid>

                <Grid item xs={6} sm={4} style={disabledVisitor ? { opacity: 0 } : undefined}>
                  <Controller
                    name={`numberOfVisitor`}
                    control={control}
                    rules={{ required: t('common.form.required') as string }}
                    render={({ field }) => (
                      <TextField
                        type="number"
                        inputProps={{ min: 0, style: { textAlign: 'right' } }}
                        {...field}
                        disabled={disabledVisitor}
                        label={t('visittable.header.number-of-visitor')}
                        error={!!errors.numberOfVisitor}
                        helperText={!!errors.numberOfVisitor && errors.numberOfVisitor.message}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={6} sm={4}>
                  <Controller
                    name={`numberOfEmployee`}
                    control={control}
                    rules={{ required: t('common.form.required') as string }}
                    render={({ field }) => (
                      <TextField
                        type="number"
                        inputProps={{ min: 0, style: { textAlign: 'right' } }}
                        {...field}
                        label={t('visittable.header.number-of-employee')}
                        error={!!errors.numberOfEmployee}
                        helperText={!!errors.numberOfEmployee && errors.numberOfEmployee.message}
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </Box>

            <Box p={2}>
              <ControllerTextField name="comment" control={control} label={t('visittable.header.comment')} multiline errors={errors} />
              <ControllerTextField name="contactAddr" control={control} label={t('visittable.header.contact-addr')} required errors={errors} />
            </Box>

            {!!data && (
              <Box px={2}>
                <List disablePadding={true}>
                  <li key="datetime" className={classes.list}>
                    <div className={classes.title}>{t('visitdialog.header.last-updated')}</div>
                    <div className={classes.field}>
                      <LastUpdatedField datetime={data.lastUpdated} />
                    </div>
                  </li>
                  <li key="info" className={classes.list}>
                    <div className={classes.title}>reservationInfo</div>
                    <div className={classes.field}>{JSON.stringify(data.reservationInfo)}</div>
                  </li>
                </List>
              </Box>
            )}

            <Box px={2}>
              <Grid container justifyContent="space-between" spacing={2} className={classes.formAction}>
                <Grid item xs={!data ? 12 : 6}>
                  <Button
                    onClick={handleSave}
                    variant="contained"
                    color="primary"
                    disabled={!isDirty || hiddenRooms || roomsLoading}
                    startIcon={<SaveIcon />}
                    fullWidth
                  >
                    {t('visitdialog.button.save')}
                  </Button>
                </Grid>
                <Grid item xs={6} style={!data ? { display: 'none' } : undefined}>
                  <Button onClick={handleDelete} variant="contained" color="primary" /*disabled={!data}*/ startIcon={<DeleteIcon />} fullWidth>
                    {t('visitdialog.button.delete')}
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </form>
        </ThemeProvider>
      </MyDialog>
      <MyConfirmDialog
        open={delConfOpen}
        onClose={handleDelConfClose}
        // title={t('visitorinfoform.delete-confirm-title')}
        message={
          data?.eventType === 'seriesMaster' ? t('visitorinfoform.delete-confirm-message.series-master') : t('visitorinfoform.delete-confirm-message')
        }
        color="secondary"
      ></MyConfirmDialog>
    </>
  );
}
