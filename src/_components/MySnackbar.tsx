import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';
import { Color } from '@material-ui/lab';

function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export type MySnackberState = {
  severity: Color;
  message: string;
  open: boolean;
};

export type MySnackberProps = {
  onClose: () => void;
} & MySnackberState;

export type MySnackberAction =
  | {
      type: Color;
      message: string;
    }
  | {
      type: 'hide';
    };

export const mySnackberReducer = (state: MySnackberState, action: MySnackberAction) => {
  switch (action.type) {
    case 'hide':
      return { ...state, open: false };
    case 'success':
    case 'info':
    case 'warning':
    case 'error':
      return { ...state, open: true, severity: action.type, message: action.message };
    default:
      return state;
  }
};

export default function MySnackbar(props: MySnackberProps) {
  const { severity, message, open, onClose } = props;

  return (
    <Snackbar open={open} autoHideDuration={1500} onClose={onClose} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
      <Alert onClose={onClose} severity={severity}>
        {message}
      </Alert>
    </Snackbar>
  );
}
