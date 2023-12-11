import { Avatar, Box, Container, Typography } from '@material-ui/core';
import { LockOutlined as LockOutlinedIcon } from '@material-ui/icons';
import { Alert } from '@material-ui/lab';
import { Copyright } from '../_components/Copyright';
import { Spinner } from '../_components/Spinner';
import { MySnackberContext, MySnackberProvider } from '_components/MySnackbarContext';
import { makeLoginStyles } from '_styles/LoginStyles';
import { useContext, useEffect, useState } from 'react';
import { get } from '_utils/Http';
import { useTranslation } from 'react-i18next';
import { getTempLocation, removeTempLocation } from '_utils/SessionStrage';
import { Location } from '_models/Location';

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

  // スピナーの状態
  const [errMsg, setErrMsg] = useState(false);

  useEffect(() => {
    // 認可コードをバックエンドへ渡す
    const sendAuthCode = async () => {
      try {
        const search = window.location.search;
        const result = await get<Response>('/oauth/callback' + search);
        if (result.parsedBody) {
          setLoding(false);
          if (result.parsedBody.ok) {
            snackberContext.dispatch({ type: 'success', message: t('common.msg.login-success') });
          } else {
            snackberContext.dispatch({ type: 'error', message: t('common.msg.login-failed') });
          }
          // ロケーションを取得
          let location = getTempLocation(); // sessionStrageからlocationを取得
          removeTempLocation(); // sessionStrageからlocationを削除
          if (!location || location === 'undefined') {
            const first = await get<Location>('/location/first');
            if (first.parsedBody) {
              location = first.parsedBody.url;
            } else {
              // throw new Error('Location is not registered.');
            }
          }
          // urlを設定
          let url = `/${location}/main/byroom`; // let url = `/${location}/main`;
          // ロケーション設定が未だの場合
          if (location === 'undefined') {
            url = '/settings/location';
          }
          setTimeout(() => {
            window.location.replace(url);
          }, 1500);
        }
      } catch (error) {
        console.log(error);
        setLoding(false);
        setErrMsg(true);
        setTimeout(() => {
          window.history.back();
        }, 5000);
      }
    };
    sendAuthCode();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      </div>
      {errMsg && (
        <Box mt={3}>
          <Alert severity="error">
            {t('common.msg.login-failed')}
            <br />
            {t('common.msg.too_many_requests')}
            <br />
            {t('common.msg.back_login')}
          </Alert>
        </Box>
      )}
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  );
}
