import React from 'react';

import { useTranslation } from 'react-i18next';

import { Box, Button, Grid, makeStyles, Paper, Typography } from '@material-ui/core';
import AddCircleIcon from '@material-ui/icons/AddCircle';

import BaseTemplate from '../BaseTemplate';

const useStyles = makeStyles(() => ({
  actionButtonArea: {
    textAlign: 'right',
    margin: 'auto',
  },
}));

export function Location() {
  const { t } = useTranslation();
  const classes = useStyles();

  return (
    <BaseTemplate adminMode menuOpen>
      <Paper square>
        <Box px={2} py={2}>
          <Grid container alignItems="stretch" justifyContent="space-between">
            <Grid container item xs={12} sm={9}>
              <Typography component="h1" variant="h6">
                {t('settings.title.role')}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={3} className={classes.actionButtonArea}>
              <Button variant="contained" color="secondary" startIcon={<AddCircleIcon />}>
                {t('settings.add-master')}
              </Button>
            </Grid>
          </Grid>
        </Box>
        <Box p={2}>Table</Box>
      </Paper>
    </BaseTemplate>
  );
}
