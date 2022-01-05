import { Avatar, Box, Container, Typography } from '@material-ui/core';
import { LockOutlined as LockOutlinedIcon } from '@material-ui/icons';
import { Copyright } from '../../_components/Copyright';
import { Spinner } from '../../_components/Spinner';
import { MySnackberContext, MySnackberProvider } from '_components/MySnackbarContext';
import { makeLoginStyles } from '_styles/MakeLoginStyles';
import { useContext, useEffect, useState } from 'react';
import { get } from '_utils/Http';
import { useTranslation } from 'react-i18next';

type Response = {
  ok: boolean;
};

const useStyles = makeLoginStyles();

export function AuthorizeWrapper() {
  return (
    <MySnackberProvider>
      <Authorize />
    </MySnackberProvider>
  );
}

export function Authorize() {
  const classes = useStyles();
  const { t } = useTranslation();
  const snackberContext = useContext(MySnackberContext); // スナックバー取得用

  // スピナーの状態
  const [isLoading, setLoding] = useState(true);

  useEffect(() => {
    // 認可コードをバックエンドへ渡す
    const sendAuthCode = async () => {
      try {
        const search = window.location.search;
        const result = await get<Response>('/oauth/callback' + search);
        if (result.parsedBody) {
          setLoding(false);
          if (result.parsedBody.ok) {
            snackberContext.dispatch({ type: 'success', message: t('common.msg.signin-success') });
          } else {
            snackberContext.dispatch({ type: 'error', message: t('common.msg.signin-failed') }); //TODO:test
          }
          setTimeout(() => {
            window.location.replace('/main');
          }, 1500);
        }
      } catch (error) {
        console.log(error);
      }
    };
    sendAuthCode();
  }, []);

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
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  );
}
