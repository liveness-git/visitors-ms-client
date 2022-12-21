import { FormHelperText, makeStyles } from '@material-ui/core';
import { DatePicker } from '@material-ui/pickers';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles({
  datePicker: {
    width: 'fit-content',
    marginRight: 20,
  },
  helperText: { marginLeft: 0, marginRight: 0, textAlign: 'center' },
});

type MyCalendarNoKeyboadProps = {
  label: string;
  date: Date | null;
  onChange: (date: Date | null) => void;
  disablePast?: boolean;
  error?: boolean;
};

function MyCalendarNoKeyboad({ label, date, onChange, disablePast, error }: MyCalendarNoKeyboadProps) {
  const { t } = useTranslation();
  const classes = useStyles();

  return (
    <DatePicker
      margin="normal"
      id="date-picker-dialog"
      label={label}
      format="yyyy/MM/dd"
      showTodayButton
      disablePast={disablePast}
      value={date}
      onChange={onChange}
      size="small"
      className={classes.datePicker}
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

export default MyCalendarNoKeyboad;
