import { useCallback, useContext, useEffect, useState } from 'react';
import { useRouteMatch } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { SubmitHandler, useForm } from 'react-hook-form';

import { Box, Grid, Button, List } from '@material-ui/core';
import { makeStyles, createStyles, createTheme, ThemeProvider } from '@material-ui/core/styles';
import { grey, purple } from '@material-ui/core/colors';

import DeleteIcon from '@material-ui/icons/Delete';
import SaveIcon from '@material-ui/icons/Save';

import { addMinutes } from 'date-fns';
import _ from 'lodash';

import { VisitorInfo, EventInputType, RoomInputType } from '_models/VisitorInfo';
import { Room } from '_models/Room';
import { LocationParams } from '_models/Location';

import { tableTheme, makeTableDialogStyle } from '_styles/TableTheme';

import { fetchPostData } from '_utils/FetchPostData';
import { useLoadData } from '_utils/useLoadData';

import { MySnackberContext } from '_components/MySnackbarContext';
import { Spinner } from '_components/Spinner';
import { ControllerTextField } from '_components/ControllerTextField';
import { AddrBookAutoComplete } from '_components/AddrBookAutoComplete';
import { MyDialog } from '_components/MyDialog';

import { RowDataType } from './DataTableBase';
import { DeleteConfirmDialog } from './DeleteConfirmDialog';
import { RoomInputFields } from './RoomInputFields';
import { RoomReadFields, strRoomStatus } from './RoomReadFields';
import { ControllerDateTimePicker } from './ControllerDateTimePicker';

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
  const match = useRouteMatch<LocationParams>();

  // 削除確認メッセージの状態
  const [delConfOpen, setDelConfOpen] = useState(false);

  // 入力フォームの登録
  const defaultValues = getDefaultValues();
  const {
    control,
    getValues,
    handleSubmit,
    reset,
    setValue,
    trigger,
    setError,
    formState: { errors, isDirty, isSubmitting, dirtyFields },
  } = useForm<Inputs>({ defaultValues });

  // 入力フォームの初期化
  useEffect(() => {
    if (open && !!data) {
      reset({
        mode: 'upd',
        iCalUId: data.iCalUId,
        subject: data.subject,
        visitorId: data.visitorId,
        visitCompany: data.visitCompany,
        visitorName: data.visitorName,
        mailto: data.mailto,
        resourcies: Object.keys(data.resourcies).reduce((newObj, room) => {
          newObj[room] = {
            roomForEdit: room,
            teaSupply: data.resourcies[room].teaSupply,
            numberOfVisitor: data.resourcies[room].numberOfVisitor,
            numberOfEmployee: data.resourcies[room].numberOfEmployee,
          };
          return newObj;
        }, {} as RoomInputType),
        comment: data.comment,
        contactAddr: data.contactAddr,
        startTime: new Date(data.startDateTime),
        endTime: new Date(data.endDateTime),
      });
    } else {
      reset(_.cloneDeep(getDefaultValues(addDefault?.start, addDefault?.roomId)));
    }
  }, [data, open, reset, addDefault]);

  // ::空き会議室の制御関連 start -------------------------->
  // 会議室コンポーネントの表示状態
  const [hiddenRooms, setHiddenRooms] = useState(false);

  // 空き会議室一覧の取得
  const defaultRoomsUrl = `/room/choices?location=${match.params.location}`;
  const [roomsUrl, setRoomsUrl] = useState(defaultRoomsUrl);
  const [{ data: rooms }] = useLoadData<Room[]>(roomsUrl, []);

  // 空き会議室一覧のURL更新
  const buildRoomsUrl = useCallback(() => {
    if (getValues('mode') === 'upd') {
      // 更新時、会議室変更は出来ないためデフォルト値
      setRoomsUrl(defaultRoomsUrl);
    } else {
      setRoomsUrl(defaultRoomsUrl + `&start=${getValues('startTime').getTime()}&end=${getValues('endTime').getTime()}`);
    }
  }, [defaultRoomsUrl, getValues]);

  // 空き会議室一覧のURLリセット
  useEffect(() => {
    if (open) {
      buildRoomsUrl();
    }
  }, [buildRoomsUrl, open]);

  // 会議室コンポーネントの表示リセット
  useEffect(() => {
    if (!open) setHiddenRooms(false);
  }, [open]);

  // ::空き会議室の制御関連 end --------------------------<

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

  // 検索ボタンアクション
  const handleSearch = async () => {
    const result = await trigger(['startTime', 'endTime']); //validate
    if (!result) return;
    buildRoomsUrl();
    setHiddenRooms(false);
  };

  // 検索ボタン活性化アクション
  const handleDateTimeChange = () => {
    if (getValues('mode') === 'upd') return; //TODO: 更新時、空き会議室検索は未対応
    if (!hiddenRooms) {
      setHiddenRooms(true);
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
          {!!data && (
            <Box px={2}>
              {(() => {
                if (data.isMSMultipleLocations) {
                  /* mode=upd & 複数会議室 */
                  return <p className={classes.note}>{t('visitdialog.notes.multiple-locations')}</p>;
                } else {
                  /* mode=upd & 単一会議室 */
                  return (
                    <List disablePadding={true}>
                      <li key="resource-status" className={classes.list}>
                        <div className={classes.title}>{t('visittable.header.resource-status')}</div>
                        <div className={classes.field}>{t(strRoomStatus(data.roomStatus))}</div>
                      </li>
                      <li key="reservation-name" className={classes.list}>
                        <div className={classes.title}>{t('visittable.header.reservation-name')}</div>
                        <div className={classes.field}>{data.reservationName}</div>
                      </li>
                    </List>
                  );
                }
              })()}
            </Box>
          )}

          <form>
            <Box p={2}>
              <ControllerTextField name="subject" control={control} label={t('visittable.header.event-subject')} required errors={errors} />

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

              <Grid container spacing={1}>
                <Grid item xs={5}>
                  <ControllerDateTimePicker
                    name="startTime"
                    control={control}
                    getValues={getValues}
                    label={t('visittable.header.event-start-time')}
                    handleDateTimeChange={handleDateTimeChange}
                    errors={errors}
                  />
                </Grid>
                <Grid item xs={5}>
                  <ControllerDateTimePicker
                    name="endTime"
                    control={control}
                    getValues={getValues}
                    label={t('visittable.header.event-end-time')}
                    handleDateTimeChange={handleDateTimeChange}
                    errors={errors}
                  />
                </Grid>
                <Grid item xs={2} style={{ margin: 'auto' }}>
                  <Button onClick={handleSearch} variant="contained" color="primary" fullWidth disabled={data?.isMSMultipleLocations || !hiddenRooms}>
                    {t('common.button.search')}
                  </Button>
                </Grid>
              </Grid>
            </Box>

            {!data ? (
              /* 新規作成 */
              !hiddenRooms && <RoomInputFields control={control} setValue={setValue} rooms={rooms} roomId={ADD_ROOM_KEY} errors={errors} />
            ) : (
              <>
                {!data.isMSMultipleLocations ? (
                  /* mode=upd & 単一会議室 */
                  !hiddenRooms && (
                    <RoomInputFields
                      control={control}
                      setValue={setValue}
                      rooms={rooms}
                      roomId={Object.keys(data.resourcies)[0]}
                      disabledRoom={true}
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

            <Box p={2}>
              <ControllerTextField name="visitCompany" control={control} label={t('visittable.header.visit-company')} required errors={errors} />
              <ControllerTextField name="visitorName" control={control} label={t('visittable.header.visitor-name')} errors={errors} />
              <ControllerTextField name="comment" control={control} label={t('visittable.header.comment')} multiline errors={errors} />
              <ControllerTextField name="contactAddr" control={control} label={t('visittable.header.contact-addr')} errors={errors} />
            </Box>

            <Box px={2}>
              <Grid container justifyContent="space-between" spacing={2} className={classes.formAction}>
                <Grid item xs={!data ? 12 : 6}>
                  <Button
                    onClick={handleSave}
                    variant="contained"
                    color="primary"
                    disabled={!isDirty || hiddenRooms}
                    startIcon={<SaveIcon />}
                    fullWidth
                  >
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
        </ThemeProvider>
      </MyDialog>
      <DeleteConfirmDialog open={delConfOpen} onClose={handleDelConfClose}></DeleteConfirmDialog>
    </>
  );
}
