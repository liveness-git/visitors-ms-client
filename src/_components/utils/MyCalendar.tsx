import { Paper } from '@material-ui/core';
import { Calendar } from '@material-ui/pickers';

type MyCalendarProps = {
  date: Date | null;
  onChange: (date: Date | null) => void;
};

function MyCalendar(props: MyCalendarProps) {
  return (
    <Paper style={{ overflow: 'hidden' }}>
      <Calendar {...props} />
    </Paper>
  );
}

export default MyCalendar;
