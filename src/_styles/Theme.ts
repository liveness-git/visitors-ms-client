import { createTheme } from '@material-ui/core/styles';
// import purple from '@material-ui/core/colors/purple';
import amber from '@material-ui/core/colors/amber';

// export const defaultPrimary = purple;
export const defaultPrimary = {
  light: '#336bbd',
  main: '#0046AD',
  dark: '#003179',
  contrastText: '#fff',
};

export const theme = createTheme({
  palette: {
    primary: defaultPrimary,
    secondary: amber,
  },
  typography: {
    button: {
      textTransform: 'none',
    },
  },
  props: {
    MuiTextField: {
      variant: 'outlined',
    },
  },
  mixins: {
    toolbar: { minHeight: 50 },
  },
  overrides: {
    MuiTooltip: {
      tooltip: {
        fontSize: '1em',
      },
    },
  },
});
