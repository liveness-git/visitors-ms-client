import { useTranslation } from 'react-i18next';

import { Button, makeStyles, createStyles, IconButton } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import CloseIcon from '@material-ui/icons/Close';
import { MouseEventHandler } from 'react';

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

type MyDialogProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
};

export function MyDialog(props: MyDialogProps) {
  const { open, onClose, title, children } = props;

  const { t } = useTranslation();
  const classes = useStyles();

  const handleCancel = (_event: MouseEventHandler, reason: string) => {
    if (reason && reason === 'backdropClick') return;
    onClose();
  };

  return (
    <>
      <Dialog open={open} onClose={handleCancel} fullWidth={true} maxWidth="sm" aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title" className={classes.root}>
          {title}
          <IconButton className={classes.closeButton} onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>{children}</DialogContent>
        <DialogActions style={{ display: 'none' }}>
          <Button onClick={onClose}>{t('common.button.cancel')}</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
