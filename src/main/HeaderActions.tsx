import { useTranslation } from 'react-i18next';

import { Box, Button, Grid, IconButton, makeStyles } from '@material-ui/core';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import ArrowLeftIcon from '@material-ui/icons/ArrowLeft';
import ArrowRIghtIcon from '@material-ui/icons/ArrowRight';

import MyCalendar from '_components/MyCalendar';
import { DataDialogAction } from './DataTableBase';

const useStyles = makeStyles(() => ({
  arrowLeft: {
    paddingTop: 7,
    marginRight: -5,
  },
  arrowRight: {
    paddingTop: 7,
    marginLeft: -5,
  },
  arrowIcon: {
    margin: 0,
    padding: 0,
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
  subtitle?: string;
  date: Date | null;
  onDateChange: (date: Date | null) => void;
  onDatePrev: () => void;
  onDateNext: () => void;
  dispatch: React.Dispatch<DataDialogAction>;
  actionButtons?: React.ReactNode[];
};

export function HeaderActions(props: HeaderActionsProps) {
  const { subtitle, date, onDateChange, onDatePrev, onDateNext, dispatch, actionButtons } = props;

  const { t } = useTranslation();
  const classes = useStyles();

  // 新規作成ボタン
  const handleCreateClick = (_event: React.ChangeEvent<{}>) => {
    dispatch({ type: 'addDataOpen' });
  };

  return (
    <>
      <Grid container alignItems="stretch" justifyContent="space-between">
        <Grid container alignItems="center" item xs={12} sm={!!actionButtons ? 6 : 9}>
          <Grid item className={classes.arrowLeft}>
            <IconButton className={classes.arrowIcon} onClick={onDatePrev}>
              <ArrowLeftIcon fontSize="large" />
            </IconButton>
          </Grid>
          <Grid item className={classes.datePicker}>
            <MyCalendar label={t('main.header.picker-label')} date={date} onChange={onDateChange} />
          </Grid>
          <Grid item className={classes.arrowRight} onClick={onDateNext}>
            <IconButton className={classes.arrowIcon}>
              <ArrowRIghtIcon fontSize="large" />
            </IconButton>
          </Grid>
          {/* <Grid item className={classes.title}>
            <Typography component="h5">{title}</Typography>
          </Grid> */}
        </Grid>

        <Grid container item justifyContent="flex-end" alignItems="center" spacing={2} xs={12} sm={!!actionButtons ? 6 : 3}>
          {!!actionButtons &&
            actionButtons.map((item, index) => {
              return (
                <Grid item key={`actionButtons-${index}`}>
                  {item}
                </Grid>
              );
            })}
          <Grid item>
            <Button variant="contained" color="secondary" startIcon={<AddCircleIcon />} onClick={handleCreateClick}>
              {t('main.header.add-event')}
            </Button>
          </Grid>
        </Grid>

        <Box pt={1}>{subtitle}</Box>
      </Grid>
    </>
  );
}
