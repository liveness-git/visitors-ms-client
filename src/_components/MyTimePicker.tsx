import { Grid, makeStyles, MenuItem, TextField } from '@material-ui/core';

const useStyles = makeStyles({
  timerSelectRoot: {
    '& svg': { display: 'none' },
  },
  timerSelect: {
    paddingRight: '15px !important',
  },
  colon: { margin: 'auto 3px' },
});

export const startTimeBufferMinute = 0;
export const endTimeBufferMinute = 30; //TODO: Interval config化？
export const change5MinuteIntervals = (date: Date) => Math.ceil(date.getTime() / 1000 / 60 / 5) * 1000 * 60 * 5; //TODO: Interval config化？
// const adjustDate = new Date(change5MinuteIntervals(selected));

const hoursList = [...Array(24)]
  .map((_, i) => i)
  .map((value) => {
    return { label: value, value: value };
  });

const minutesList = [...Array(12)]
  .map((_, i) => i * 5)
  .map((value) => {
    return { label: value, value: value };
  });

type MyTimePickerProps = {
  selected: Date;
  onChange: (date: Date) => void;
};

function MyTimePicker(props: MyTimePickerProps) {
  const { selected, onChange } = props;

  const classes = useStyles();

  return (
    <Grid container>
      <Grid item>
        <TextField
          className={classes.timerSelectRoot}
          select
          value={selected.getHours()}
          onChange={(e) => {
            onChange(new Date(selected.getFullYear(), selected.getMonth(), selected.getDate(), Number(e.target.value), selected.getMinutes()));
          }}
          inputProps={{ className: classes.timerSelect }}
        >
          {hoursList.map((option, index) => (
            <MenuItem key={`hour-${index}`} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
      <Grid item className={classes.colon}>
        :
      </Grid>
      <Grid item>
        <TextField
          className={classes.timerSelectRoot}
          select
          value={selected.getMinutes()}
          onChange={(e) => {
            onChange(new Date(selected.getFullYear(), selected.getMonth(), selected.getDate(), selected.getHours(), Number(e.target.value)));
          }}
          inputProps={{ className: classes.timerSelect }}
        >
          {minutesList.map((option, index) => (
            <MenuItem key={`minute-${index}`} value={option.value}>
              {('00' + Number(option.label)).slice(-2)}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
    </Grid>
  );
}

export default MyTimePicker;