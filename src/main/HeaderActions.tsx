import { useTranslation } from 'react-i18next';

import { Button, Grid, makeStyles, Typography } from '@material-ui/core';
import AddCircleIcon from '@material-ui/icons/AddCircle';

import MyCalendar from '_components/MyCalendar';
import { DataDialogAction } from './DataTableBase';

const useStyles = makeStyles(() => ({
  datePickerArea: {},
  actionButtonArea: {
    textAlign: 'right',
    margin: 'auto',
  },
  datePicker: {
    margin: 'auto 0',
  },
  title: {
    margin: 'auto 0.25em',
  },
}));

type HeaderActionsProps = {
  title: string;
  date: Date | null;
  onDateChange: (date: Date | null) => void;
  dispatch: React.Dispatch<DataDialogAction>;
};

export function HeaderActions(props: HeaderActionsProps) {
  const { title, date, onDateChange, dispatch } = props;

  const { t } = useTranslation();
  const classes = useStyles();

  // 新規作成ボタン
  const handleCreateClick = (_event: React.ChangeEvent<{}>) => {
    dispatch({ type: 'addDataOpen' });
  };

  return (
    <>
      <Grid container alignItems="stretch" justifyContent="space-between">
        <Grid container item xs={12} sm={9} className={classes.datePickerArea}>
          <Grid item className={classes.datePicker}>
            <MyCalendar label={t('main.header.picker-label')} date={date} onChange={onDateChange} />
          </Grid>
          <Grid item className={classes.title}>
            <Typography component="h5">{title}</Typography>
          </Grid>
        </Grid>
        <Grid item xs={12} sm={3} className={classes.actionButtonArea}>
          <Button variant="contained" color="secondary" startIcon={<AddCircleIcon />} onClick={handleCreateClick}>
            {t('main.header.add-event')}
          </Button>
        </Grid>
      </Grid>
    </>
  );
}
