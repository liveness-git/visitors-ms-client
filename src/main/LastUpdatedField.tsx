import { format } from 'date-fns';

type LastUpdatedFieldProps = {
  datetime: number;
};

export const LastUpdatedField = (props: LastUpdatedFieldProps) => {
  const { datetime } = props;

  return <>{format(datetime, 'yyyy/MM/dd HH:mm:ss')}</>;
};
