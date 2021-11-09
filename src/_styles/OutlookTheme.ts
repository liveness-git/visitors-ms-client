import { createTheme } from '@material-ui/core/styles';
import blue from '@material-ui/core/colors/blue';

export const outlookTheme = createTheme({
  palette: {
    primary: blue,
    secondary: blue,
  },
  props: {
    MuiTextField: {
      variant: 'outlined',
      margin: 'dense',
      fullWidth: true,
      minRows: 4,
    },
    MuiInputLabel: {
      // shrink: true,
    },
  },
});
