import { MouseEventHandler, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import i18next from 'i18next';

import { Box, Button, createStyles, Grid, IconButton, makeStyles, MenuItem, TextField } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

import CloseIcon from '@material-ui/icons/Close';
import LoopIcon from '@material-ui/icons/Loop';

import { DeepMap, DeepPartial, FieldError, UseFormGetValues, UseFormSetValue } from 'react-hook-form';

import { Inputs } from './RowDataInputDialog';

import { nameOfRecurrencePatternType, PatternedRecurrenceInput, RecurrencePatternType } from '_models/PatternedRecurrence';

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
  })
);

const patternTypeList = nameOfRecurrencePatternType.map((value) => {
  return { label: i18next.t(`recurrence-dialog.pattern.type.${value}`), value: value };
});

type ControllerRecurrenceProps = {
  activeRoomSelect: () => void;
  activeSearchButton: () => void;
  getValues: UseFormGetValues<Inputs>;
  setValue: UseFormSetValue<Inputs>;
  errors: DeepMap<DeepPartial<Inputs>, FieldError>;
};

export function ControllerRecurrence(props: ControllerRecurrenceProps) {
  const { activeRoomSelect, activeSearchButton, getValues, setValue, errors } = props;

  const { t } = useTranslation();
  const classes = useStyles();

  const [patternType, setPatternType] = useState<RecurrencePatternType>('daily'); //TODO:とりま

  // 定期パターン文章
  const [patternInfo, setPatternInfo] = useState('');

  //ダイアログの状態
  const [open, setOpen] = useState(false);

  // 初期値の設定
  useEffect(() => {
    if (open) {
      const type = !!getValues('recurrence') ? getValues('recurrence')!.pattern.type : nameOfRecurrencePatternType[0];
      setPatternType(type);
    }
  }, [getValues, open]);

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
  const handleOk = () => {
    //TODO: newValuesを数パターン作ってひとまずpostしてみる。
    const newValues = { pattern: { type: patternType }, range: {} } as PatternedRecurrenceInput;

    setValue('recurrence', newValues, { shouldDirty: true });

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
          <Box px={2}>
            <TextField
              label={t('recurrence-dialog.header.pattern.type')}
              select={true}
              value={patternType}
              onChange={(e) => {
                setPatternType(e.target.value as RecurrencePatternType);
              }}
              error={!!errors.recurrence?.pattern?.type}
              helperText={!!errors.recurrence?.pattern?.type && errors.recurrence?.pattern?.type.message}
            >
              {patternTypeList.map((option, index) => (
                <MenuItem key={`patternTypeList-${index}`} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
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
