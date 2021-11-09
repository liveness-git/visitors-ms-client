import { ThemeProvider } from '@material-ui/core';
import { theme } from './_styles/Theme';
import CssBaseline from '@material-ui/core/CssBaseline';
import { Routes } from './Routes';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import JaDateFnsUtils from '_components/utils/JaDateFnsUtils';
import jaLocale from 'date-fns/locale/ja';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <MuiPickersUtilsProvider utils={JaDateFnsUtils} locale={jaLocale}>
        <Routes />
      </MuiPickersUtilsProvider>
    </ThemeProvider>
  );
}

export default App;
