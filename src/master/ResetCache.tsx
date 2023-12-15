import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Button, Grid, Paper, Typography, makeStyles } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';

import BaseTemplate from '_components/BaseTemplate';
import { Spinner } from '_components/Spinner';
import { get } from '_utils/Http';

const useStyles = makeStyles(() => ({
  actionButtonArea: {
    textAlign: 'right',
    margin: 'auto',
  },
}));

export function ResetCache() {
  const { t } = useTranslation();
  const classes = useStyles();

  // ローディングの状態
  const [isLoading, setIsLoading] = useState(false);

  // 実行ボタン
  const handleExecClick = async (_event: React.ChangeEvent<{}>) => {
    if (window.confirm(`${t('settings.reset-cache.confirm')}`)) {
      setIsLoading(true);
      try {
        await get('/api/cache/events/save');
        alert(`${t('settings.reset-cache.done')}`);
      } catch (error) {
        alert(`${t('settings.reset-cache.error')}`);
      }
      setIsLoading(false);
    }
  };

  return (
    <>
      <Spinner open={isLoading} />
      <BaseTemplate adminMode menuOpen>
        <Paper square>
          <Box p={2}>
            <Grid container alignItems="stretch" justifyContent="space-between">
              <Grid container item xs={12} sm={9}>
                <Typography component="h1" variant="h6">
                  {t(`settings.title.reset-cache`)}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={3} className={classes.actionButtonArea}>
                <Button variant="contained" color="secondary" startIcon={<CloudDownloadIcon />} onClick={handleExecClick}>
                  {t('settings.reset-cache.execution')}
                </Button>
              </Grid>
            </Grid>
            <Box p={2}>
              <Alert severity="warning">
                <Typography>
                  {t('settings.reset-cache.description1')}
                  <br />
                  {t('settings.reset-cache.description2')}
                </Typography>
              </Alert>
            </Box>
          </Box>
        </Paper>
      </BaseTemplate>
    </>
  );
}
