import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

type MyConfirmDialogPorps = {
  open: boolean;
  onClose: (ok: boolean) => void;
  title?: string;
  message: string | React.ReactNode;
  color?: 'inherit' | 'default' | 'primary' | 'secondary';
};

export function MyConfirmDialog(props: MyConfirmDialogPorps) {
  const { open, onClose, title, message, color } = props;

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
        {!!title && <DialogTitle id="alert-dialog-title">{title}</DialogTitle>}
        <DialogContent>
          <DialogContentText id="alert-dialog-description">{message}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleOkClose} color={color}>
            OK
          </Button>
          <Button onClick={handleCancelClose} color={color} autoFocus>
            CANCEL
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
