import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import { useTranslation } from 'react-i18next';

type DeleteConfirmDialogPorps = {
  open: boolean;
  onClose: (deleteOk: boolean) => void;
};

export function DeleteConfirmDialog(props: DeleteConfirmDialogPorps) {
  const { open, onClose } = props;

  const { t } = useTranslation();

  const handleClose = () => {
    onClose(false);
  };
  const handleOkClose = () => {
    onClose(true);
  };
  const handleCancelClose = () => {
    onClose(false);
  };

  return (
    <div>
      <Dialog open={open} onClose={handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        {/* <DialogTitle id="alert-dialog-title">{t('visitorinfoform.delete-confirm-title')}</DialogTitle> */}
        <DialogContent>
          <DialogContentText id="alert-dialog-description">{t('common.msg.delete-confirm')}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleOkClose} color="secondary">
            OK
          </Button>
          <Button onClick={handleCancelClose} color="secondary" autoFocus>
            CANCEL
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
