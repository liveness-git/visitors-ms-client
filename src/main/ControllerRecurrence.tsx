import { MouseEventHandler, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Button, createStyles, IconButton, makeStyles } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

import CloseIcon from '@material-ui/icons/Close';
import LoopIcon from '@material-ui/icons/Loop';

import { Control, DeepMap, DeepPartial, FieldError, UseFormGetValues, UseFormSetValue } from 'react-hook-form';

import { Inputs } from './RowDataInputDialog';

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

type ControllerRecurrenceProps = {
  control: Control<Inputs, object>;
  getValues: UseFormGetValues<Inputs>;
  setValue: UseFormSetValue<Inputs>;
  errors: DeepMap<DeepPartial<Inputs>, FieldError>;
};

export function ControllerRecurrence(props: ControllerRecurrenceProps) {
  const { control, getValues, setValue, errors } = props;

  const { t } = useTranslation();
  const classes = useStyles();

  //ダイアログの状態
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = (_event: MouseEventHandler, reason: string) => {
    if (reason && reason === 'backdropClick') return;
    handleCancel();
  };

  const handleOk = () => {
    setOpen(false);
  };

  const handleCancel = () => {
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
        <Button size="small" color="primary" startIcon={<LoopIcon />} onClick={handleOpen}>
          {t('visitdialog.button.edit-recurrence')}
        </Button>
      )}

      <Dialog open={open} onClose={handleClose} fullWidth={true} maxWidth="sm" aria-labelledby="form-dialog-title">
        <DialogTitle className={classes.root}>
          {t('recurrence-dialog-title')}
          <IconButton className={classes.closeButton} onClick={handleCancel}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers></DialogContent>
        <DialogActions>
          <Button onClick={handleOk}>{t('common.button.ok')}</Button>
          <Button onClick={handleCancel}>{t('common.button.cancel')}</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
