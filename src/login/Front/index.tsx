import { Avatar, Box, Button, Container, makeStyles, TextField, Typography } from '@material-ui/core';
import { LockOutlined as LockOutlinedIcon } from '@material-ui/icons';
import { useTranslation } from 'react-i18next';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Copyright } from '../../_components/Copyright';
import { makeLoginStyles } from '_styles/MakeLoginStyles';

const useStyles = makeLoginStyles();

type LoginInputs = {
  email: string;
  password: string;
};

export function Login() {
  const { t } = useTranslation();
  const classes = useStyles();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInputs>();

  const login: SubmitHandler<LoginInputs> = (data) => {
    alert('test');
    console.log(data);
  };

  return (
    <Container component="main" maxWidth="xs">
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Visitors for Microsoft
        </Typography>
        <form className={classes.form} onSubmit={handleSubmit(login)}>
          <TextField
            margin="normal"
            fullWidth
            id="email"
            label={t('login.form.email')}
            autoComplete="email"
            autoFocus
            {...register('email', {
              required: t('common.form.required') as string,
              pattern: {
                value: /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$/,
                message: t('login.form.invalid-pattern'),
              },
            })}
            error={!!errors.email}
            helperText={errors.email && errors.email.message}
          />
          <TextField
            margin="normal"
            fullWidth
            label={t('login.form.password')}
            type="password"
            id="password"
            autoComplete="current-password"
            {...register('password', {
              required: t('login.form.required') as string,
            })}
            error={!!errors.password}
            helperText={errors.password && errors.password.message}
          />
          <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit}>
            {t('login.form.submit')}
          </Button>
        </form>
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  );
}
