import { useTranslation } from 'react-i18next';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import { UserStatus } from '_models/User';

type ReservationNameFieldProps = {
  name: string;
  status: UserStatus;
};

function ReservationNameField(props: ReservationNameFieldProps) {
  const { name, status } = props;

  const { t } = useTranslation();

  return (
    <>
      {name}
      {status === 'declined' && (
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            color: 'red',
            verticalAlign: 'bottom',
            marginLeft: 15,
            fontSize: '0.95em',
          }}
        >
          <ErrorOutlineIcon fontSize="small" style={{ marginRight: 3 }} />
          {t('visitdialog.notes.reservation-status-declined')}
        </div>
      )}
    </>
  );
}

export default ReservationNameField;
