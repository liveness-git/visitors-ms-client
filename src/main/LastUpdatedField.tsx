import { useContext } from 'react';
import { MuiPickersContext } from '@material-ui/pickers';
import { format } from 'date-fns';

type LastUpdatedFieldProps = {
  datetime: number;
};

export const LastUpdatedField = (props: LastUpdatedFieldProps) => {
  const { datetime } = props;

  const muiPickContext = useContext(MuiPickersContext); // locale取得用

  return <>{format(datetime, 'yyyy/MM/dd HH:mm:ss', { locale: muiPickContext?.locale })}</>;
};
