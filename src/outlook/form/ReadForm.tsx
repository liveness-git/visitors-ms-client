import { TextField, Grid, Switch, FormControlLabel, ThemeProvider } from '@material-ui/core';

import { useTranslation } from 'react-i18next';

import { useLoadData } from '_utils/useLoadData';
import { Spinner } from '_components/Spinner';

import { VisitorInfoPersonal } from '_models/VisitorInfo';
import { readOnlyTheme } from '_styles/OutlookTheme';

export function ReadForm() {
  const { t } = useTranslation();

  // データ取得
  const [{ data, isLoading, isError }] = useLoadData<VisitorInfoPersonal>('/test/testdata4.json', undefined);

  // データ取得中
  if (isLoading) {
    return <Spinner open={true} />;
  }
  // データ取得失敗した場合
  if (isError) {
    return <div>{t('common.msg.fetch-failed')}</div>;
  }
  // 該当データが存在しなかった場合
  if (!isLoading && !data) {
    return <div>{t('common.msg.no-data')}</div>;
  }

  return (
    <>
      <ThemeProvider theme={readOnlyTheme}>
        <TextField value={data?.visitCompany} label={t('visittable.header.visit-company')} />
        <TextField value={data?.visitorName} multiline label={t('visittable.header.visitor-name')} />

        <Grid container spacing={1}>
          <Grid item xs={12} md={4}>
            <FormControlLabel control={<Switch checked={data?.teaSupply} />} label={t('visittable.header.tea-supply')} />
          </Grid>
          <Grid item xs={6} md={4}>
            <TextField
              value={data?.numberOfVisitor}
              inputProps={{ style: { textAlign: 'right' } }}
              label={t('visittable.header.number-of-visitor')}
            />
          </Grid>
          <Grid item xs={6} md={4}>
            <TextField
              value={data?.numberOfEmployee}
              inputProps={{ style: { textAlign: 'right' } }}
              label={t('visittable.header.number-of-employee')}
            />
          </Grid>
        </Grid>

        <TextField value={data?.comment} multiline label={t('visittable.header.comment')} />
        <TextField value={data?.reservationName} label={t('visittable.header.reservation-name')} />
        <TextField value={data?.contactAddr} label={t('visittable.header.contact-addr')} />
      </ThemeProvider>
    </>
  );
}
