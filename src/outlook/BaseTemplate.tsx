import { Box, Paper, Typography } from '@material-ui/core';
import { createStyles, makeStyles, ThemeProvider } from '@material-ui/core/styles';

import { outlookTheme } from '../_styles/OutlookTheme';
import { Copyright } from '_components/Copyright';
import { MySnackberProvider } from '_components/MySnackbarContext';

const useStyles = makeStyles(() =>
  createStyles({
    layout: {
      width: 'auto',
      marginLeft: outlookTheme.spacing(2),
      marginRight: outlookTheme.spacing(2),
      [outlookTheme.breakpoints.up(600 + outlookTheme.spacing(2) * 2)]: {
        width: 600,
        marginLeft: 'auto',
        marginRight: 'auto',
      },
    },
    paper: {
      marginTop: outlookTheme.spacing(3),
      marginBottom: outlookTheme.spacing(3),
      padding: outlookTheme.spacing(2),
      [outlookTheme.breakpoints.up(600 + outlookTheme.spacing(3) * 2)]: {
        marginTop: outlookTheme.spacing(6),
        marginBottom: outlookTheme.spacing(6),
        padding: outlookTheme.spacing(3),
      },
    },
  })
);

type BaseTemplateProps = {
  children: React.ReactNode;
  title: string;
};

const BaseTemplate = ({ children, title }: BaseTemplateProps) => {
  const classes = useStyles();

  return (
    <ThemeProvider theme={outlookTheme}>
      <MySnackberProvider>
        <main className={classes.layout}>
          <Paper className={classes.paper}>
            <Typography component="h1" variant="h4" align="center">
              {title}
            </Typography>
            {children}
          </Paper>
          <Box marginBottom={2}>
            <Copyright />
          </Box>
        </main>
      </MySnackberProvider>
    </ThemeProvider>
  );
};
export default BaseTemplate;
