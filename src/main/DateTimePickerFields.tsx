import { Grid, makeStyles } from '@material-ui/core';
import MyTimePicker from '_components/MyTimePicker';
import MyCalendar from '_components/MyCalendar';

const useStyles = makeStyles({
  time: {
    marginTop: 7,
  },
  timeBetween: {
    margin: 'auto 10px',
  },
});

type DateTimePickerFieldsProps = {
  label: string;
  start: Date;
  end: Date;
  onDateChange: (date: Date) => void;
  onStartChange: (date: Date) => void;
  onEndChange: (date: Date) => void;
};

export function DateTimePickerFields(props: DateTimePickerFieldsProps) {
  const { label, start, end, onDateChange, onStartChange, onEndChange } = props;

  const classes = useStyles();

  const handleDateChange = (date: Date | null) => {
    if (!date) return;
    onDateChange(date);
  };

  return (
    <Grid container spacing={1}>
      <Grid item xs={4}>
        <MyCalendar
          label={label}
          date={start}
          disablePast={true}
          onChange={handleDateChange}
          // error={!!errMsg.range.startDate}
        />
      </Grid>
      <Grid container item xs={6}>
        <Grid item className={classes.time}>
          <MyTimePicker selected={start} onChange={onStartChange}></MyTimePicker>
        </Grid>
        <Grid item className={classes.timeBetween}>
          -
        </Grid>
        <Grid item className={classes.time}>
          <MyTimePicker selected={end} onChange={onEndChange}></MyTimePicker>
        </Grid>
      </Grid>
      <Grid item xs={2}></Grid>
    </Grid>
  );
}
