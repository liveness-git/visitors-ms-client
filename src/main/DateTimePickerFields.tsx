import { FormHelperText, Grid, makeStyles } from '@material-ui/core';
import MyTimePicker from '_components/MyTimePicker';
import MyCalendarNoKeyboad from '_components/MyCalendarNoKeyboad';

const useStyles = makeStyles({
  time: {
    marginTop: 'auto',
    marginBottom: 'auto',
  },
  timeBetween: {
    margin: 'auto',
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
  disablePast?: boolean;
  disabled?: boolean;
  errMsg?: string[];
};

export function DateTimePickerFields(props: DateTimePickerFieldsProps) {
  const { label, start, end, onDateChange, onStartChange, onEndChange, disablePast, disabled, errMsg } = props;

  const classes = useStyles();

  const handleDateChange = (date: Date | null) => {
    if (!date) return;
    onDateChange(date);
  };

  return (
    <Grid container>
      <Grid item container>
        <Grid item xs={12} sm={5}>
          <MyCalendarNoKeyboad
            label={label}
            date={start}
            disablePast={disablePast}
            disabled={disabled}
            onChange={handleDateChange}
            error={!!errMsg}
          />
        </Grid>
        <Grid container item xs={12} sm={7}>
          <Grid item className={classes.time}>
            <MyTimePicker selected={start} onChange={onStartChange} disabled={disabled} error={!!errMsg}></MyTimePicker>
          </Grid>
          <Grid item className={classes.timeBetween}>
            -
          </Grid>
          <Grid item className={classes.time}>
            <MyTimePicker selected={end} onChange={onEndChange} disabled={disabled} error={!!errMsg}></MyTimePicker>
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
