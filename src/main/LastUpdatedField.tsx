import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';

type LastUpdatedFieldProps = {
  datetime: number;
};

export const LastUpdatedField = (props: LastUpdatedFieldProps) => {
  const { datetime } = props;

  const { t } = useTranslation();

  return <>{format(datetime, 'yyyy/MM/dd HH:mm:ss')}</>;
};
