import { FormHelperText, makeStyles } from '@material-ui/core';
import { KeyboardDatePicker } from '@material-ui/pickers';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles({
  keyboardDatePicker: {
    '& .MuiOutlinedInput-adornedEnd': { paddingRight: 0 },
    width: 'fit-content',
  },
  helperText: { marginLeft: 0, marginRight: 0, textAlign: 'center' },
});

type MyCalendarProps = {
  label: string;
  date: Date | null;
  onChange: (date: Date | null) => void;
  disablePast?: boolean;
  error?: boolean;
};

function MyCalendar({ label, date, onChange, disablePast, error }: MyCalendarProps) {
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
      error={error}
      invalidDateMessage={
        <FormHelperText className={classes.helperText} error>
          {t('common.error.Invalid-date')}
        </FormHelperText>
      }
      minDateMessage={
        <FormHelperText className={classes.helperText} error>
          {t('common.error.Invalid-min-date')}
        </FormHelperText>
      }
      maxDateMessage={
        <FormHelperText className={classes.helperText} error>
          {t('common.error.Invalid-max-date')}
        </FormHelperText>
      }
    />
  );
}

export default MyCalendar;
