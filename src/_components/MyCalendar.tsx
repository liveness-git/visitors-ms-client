import { makeStyles } from '@material-ui/core';
import { KeyboardDatePicker } from '@material-ui/pickers';

const useStyles = makeStyles({
  keyboardDatePicker: {
    '& .MuiOutlinedInput-adornedEnd': { paddingRight: 0 },
  },
});

type MyCalendarProps = {
  label: string;
  date: Date | null;
  onChange: (date: Date | null) => void;
};

function MyCalendar({ label, date, onChange }: MyCalendarProps) {
  const classes = useStyles();
  return (
    <KeyboardDatePicker
      margin="normal"
      id="date-picker-dialog"
      label={label}
      format="yyyy/MM/dd"
      showTodayButton
      value={date}
      onChange={onChange}
      KeyboardButtonProps={{
        'aria-label': 'change date',
      }}
      size="small"
      className={classes.keyboardDatePicker}
      inputProps={{
        style: {
          width: 85,
        },
      }}
    />
  );
}

export default MyCalendar;
