import { useTranslation } from 'react-i18next';

import { Button } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

type MyDialogProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
};

export function MyDialog(props: MyDialogProps) {
  const { open, onClose, title, children } = props;

  const { t } = useTranslation();

  const handleCancel = () => {
    onClose();
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth={true} maxWidth="sm" aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">{title}</DialogTitle>
        <DialogContent dividers>{children}</DialogContent>
        <DialogActions>
          <Button onClick={handleCancel}>{t('common.button.cancel')}</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
