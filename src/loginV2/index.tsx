import { useTranslation } from 'react-i18next';
import { useRouteMatch } from 'react-router-dom';

import { Avatar, Box, Button, Container, Typography } from '@material-ui/core';
import { LockOutlined as LockOutlinedIcon } from '@material-ui/icons';

import { useMsal } from '@azure/msal-react';

import { Copyright } from '../_components/Copyright';
import { makeLoginStyles } from '_styles/LoginStyles';
import { saveTempLocation } from '_utils/SessionStrage';
import { LocationParams } from '_models/Location';

const useStyles = makeLoginStyles();

export function SignIn() {
  const { t } = useTranslation();
  const classes = useStyles();
  const match = useRouteMatch<LocationParams>();

  const { instance } = useMsal();

  const handleClick = () => {
    saveTempLocation(match.params.location); // sessionStrageにlocationを格納
    instance.loginRedirect();
  };

  return (
    <Container component="main" maxWidth="xs">
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          {process.env.REACT_APP_SYSTEM_NAME}
        </Typography>
        <Button onClick={handleClick} fullWidth variant="contained" color="primary" className={classes.submit}>
          {t('login.msal.login')}
        </Button>
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  );
}
