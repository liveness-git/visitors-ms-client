import { useTranslation } from 'react-i18next';

import { Button, Grid, makeStyles, Typography } from '@material-ui/core';
import AddCircleIcon from '@material-ui/icons/AddCircle';

import { DataDialogAction } from './DataTableBase';
import { Mastertype } from './RowDataInputDialog';

const useStyles = makeStyles(() => ({
  actionButtonArea: {
    textAlign: 'right',
    margin: 'auto',
  },
}));

export type Columns = {
  title: string;
  field: string;
};

type HeaderActionsProps = {
  master: Mastertype;
  dispatch: React.Dispatch<DataDialogAction>;
};

export function HeaderActions(props: HeaderActionsProps) {
  const { master, dispatch } = props;

  const { t } = useTranslation();
  const classes = useStyles();

  // 新規作成ボタン
  const handleCreateClick = (_event: React.ChangeEvent<{}>) => {
    dispatch({ type: 'addDataOpen' });
  };

  return (
    <>
      <Grid container alignItems="stretch" justifyContent="space-between">
        <Grid container item xs={12} sm={9}>
          <Typography component="h1" variant="h6">
            {t(`settings.title.${master}`)}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={3} className={classes.actionButtonArea}>
          <Button variant="contained" color="secondary" startIcon={<AddCircleIcon />} onClick={handleCreateClick}>
            {t('settings.add-master')}
          </Button>
        </Grid>
      </Grid>
    </>
  );
}
