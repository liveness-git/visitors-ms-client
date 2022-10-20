import { makeStyles } from '@material-ui/core';
import { KeyboardDatePicker } from '@material-ui/pickers';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles({
  keyboardDatePicker: {
    '& .MuiOutlinedInput-adornedEnd': { paddingRight: 0 },
  },
});

type MyCalendarProps = {
  label: string;
  date: Date | null;
  onChange: (date: Date | null) => void;
  disablePast?: boolean;
  maxDate?: Date | null;
  minDate?: Date | null;
  errMsg?: string[];
};

function MyCalendar({ label, date, onChange, disablePast, maxDate, minDate, errMsg }: MyCalendarProps) {
  const { t } = useTranslation();
  const classes = useStyles();
  return (
    <KeyboardDatePicker
      margin="normal"
      id="date-picker-dialog"
      label={label}
      format="yyyy/MM/dd"
      showTodayButton
      disablePast={disablePast}
      maxDate={!!maxDate ? maxDate : undefined}
      maxDateMessage={t('my-calendar.error.max-date-message')}
      minDate={!!minDate ? minDate : undefined}
      minDateMessage={t('my-calendar.error.min-date-message')}
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
      error={!!errMsg}
      helperText={!!errMsg && errMsg}
    />
  );
}

export default MyCalendar;
