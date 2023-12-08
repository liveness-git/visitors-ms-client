import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useRouteMatch } from 'react-router-dom';

import { Avatar, Box, Button, Container, Typography } from '@material-ui/core';
import { LockOutlined as LockOutlinedIcon } from '@material-ui/icons';

import { Copyright } from '../_components/Copyright';
import { Spinner } from '../_components/Spinner';
import { makeLoginStyles } from '_styles/LoginStyles';
import { get } from '_utils/Http';
import { saveTempLocation } from '_utils/SessionStrage';
import { LocationParams } from '_models/Location';

type Response = {
  url: string;
};

const useStyles = makeLoginStyles();

export function SignIn() {
  const { t } = useTranslation();
  const classes = useStyles();
  const match = useRouteMatch<LocationParams>();

  // スピナーの状態
  const [isLoading, setLoding] = useState(false);

  const handleClick = async () => {
    try {
      setLoding(true);
      saveTempLocation(match.params.location); // sessionStrageにlocationを格納
      const result = await get<Response>('/oauth/signin');
      if (result.parsedBody) {
        window.location.href = result.parsedBody.url;
      }
    } catch (error) {
      console.log(error);
      setLoding(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Spinner open={isLoading} />
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
