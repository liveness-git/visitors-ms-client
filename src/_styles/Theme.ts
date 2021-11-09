import { createTheme } from '@material-ui/core/styles';
import purple from '@material-ui/core/colors/purple';
import amber from '@material-ui/core/colors/amber';

export const theme = createTheme({
  palette: {
    primary: purple,
    secondary: amber,
  },
  props: {
    MuiTextField: {
      variant: 'outlined',
    },
  },
  mixins: {
    toolbar: { minHeight: 50 },
  },
});
