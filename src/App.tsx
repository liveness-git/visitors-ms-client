import { ThemeProvider } from '@material-ui/core';
import { theme } from './_styles/Theme';
import CssBaseline from '@material-ui/core/CssBaseline';
import { Routes } from './Routes';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import JaDateFnsUtils from '_utils/JaDateFnsUtils';
import jaLocale from 'date-fns/locale/ja';

import { IPublicClientApplication } from '@azure/msal-browser';
import { MsalProvider } from '@azure/msal-react';

type AppProps = { msalInstance: IPublicClientApplication };

function App({ msalInstance }: AppProps) {
  return (
    <MsalProvider instance={msalInstance}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <MuiPickersUtilsProvider utils={JaDateFnsUtils} locale={jaLocale}>
          <Routes />
        </MuiPickersUtilsProvider>
      </ThemeProvider>
    </MsalProvider>
  );
}

export default App;
