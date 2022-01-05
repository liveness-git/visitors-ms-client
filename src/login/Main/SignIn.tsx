import { useState } from 'react';
import { Avatar, Box, Button, Container, Typography } from '@material-ui/core';
import { LockOutlined as LockOutlinedIcon } from '@material-ui/icons';
import { Copyright } from '../../_components/Copyright';
import { Spinner } from '../../_components/Spinner';
import { makeLoginStyles } from '_styles/MakeLoginStyles';
import { useTranslation } from 'react-i18next';
import { get } from '_utils/Http';

type Response = {
  url: string;
};

const useStyles = makeLoginStyles();

export function SignIn() {
  const { t } = useTranslation();
  const classes = useStyles();

  // スピナーの状態
  const [isLoading, setLoding] = useState(false);

  const handleClick = async () => {
    try {
      setLoding(true);
      const result = await get<Response>('/oauth/signin');
      if (result.parsedBody) {
        window.location.href = result.parsedBody.url;
      }
    } catch (error) {
      console.log(error);
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
          Visitors for Microsoft
        </Typography>
        <Button onClick={handleClick} fullWidth variant="contained" color="primary" className={classes.submit}>
          {t('login.msal.signin')}
        </Button>
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  );
}
