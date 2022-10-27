import { FormHelperText, Grid, makeStyles } from '@material-ui/core';
import MyTimePicker from '_components/MyTimePicker';
import MyCalendar from '_components/MyCalendar';

const useStyles = makeStyles({
  time: {
    marginTop: 7,
  },
  timeBetween: {
    margin: 'auto 10px',
  },
  error: {
    marginTop: -5,
  },
});

type DateTimePickerFieldsProps = {
  label: string;
  start: Date;
  end: Date;
  onDateChange: (date: Date) => void;
  onStartChange: (date: Date) => void;
  onEndChange: (date: Date) => void;
  errMsg?: string[];
};

export function DateTimePickerFields(props: DateTimePickerFieldsProps) {
  const { label, start, end, onDateChange, onStartChange, onEndChange, errMsg } = props;

  const classes = useStyles();

  const handleDateChange = (date: Date | null) => {
    if (!date) return;
    onDateChange(date);
  };

  return (
    <Grid container>
      <Grid item container justifyContent="flex-start" spacing={1}>
        <Grid item xs={5}>
          <MyCalendar label={label} date={start} disablePast={true} onChange={handleDateChange} error={!!errMsg} />
        </Grid>
        <Grid container item xs={7}>
          <Grid item className={classes.time}>
            <MyTimePicker selected={start} onChange={onStartChange} error={!!errMsg}></MyTimePicker>
          </Grid>
          <Grid item className={classes.timeBetween}>
            -
          </Grid>
          <Grid item className={classes.time}>
            <MyTimePicker selected={end} onChange={onEndChange} error={!!errMsg}></MyTimePicker>
          </Grid>
        </Grid>
      </Grid>
      {!!errMsg && (
        <Grid item xs={12}>
          <FormHelperText className={classes.error} error>
            {errMsg}
          </FormHelperText>
        </Grid>
      )}
    </Grid>
  );
}
