import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { Color } from '@material-ui/lab';

function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
}));

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

  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Snackbar open={open} autoHideDuration={1500} onClose={onClose} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert onClose={onClose} severity={severity}>
          {message}
        </Alert>
      </Snackbar>
    </div>
  );
}
