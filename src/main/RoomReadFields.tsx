import { useTranslation } from 'react-i18next';
import { Box, List } from '@material-ui/core';
import { ResourciesReadOnly, VisitorInfoResourcies } from '_models/VisitorInfo';
import { makeTableDialogStyle } from '_styles/TableTheme';

const useRowDataDialogStyles = makeTableDialogStyle();

export const strRoomStatus = (status: string | undefined) => {
  switch (status) {
    case 'accepted':
      return 'visitdialog.view.resource-status-accepted';
    case 'declined':
      return 'visitdialog.view.resource-status-declined';
    default:
      return '';
  }
};

type RoomReadFieldsProps = {
  data: VisitorInfoResourcies & ResourciesReadOnly;
  hiddenTeaSupply?: boolean;
};

export function RoomReadFields(props: RoomReadFieldsProps) {
  const { data, hiddenTeaSupply } = props;

  const { t } = useTranslation();
  const classes = useRowDataDialogStyles();

  return (
    <Box px={2} pt={2}>
      <List disablePadding={true}>
        <li key="room-name" className={classes.list}>
          <div className={classes.title}>{t('visittable.header.room-name')}</div>
          <div className={classes.field}>
            {data.roomName} {'<'}
            {data.roomEmail}
            {'>'}
          </div>
        </li>
        <li key="resource-status" className={classes.list}>
          <div className={classes.title}>{t('visittable.header.resource-status')}</div>
          <div className={classes.field}>{t(strRoomStatus(data.roomStatus))}</div>
        </li>

        {!hiddenTeaSupply && (
          <>
            <li key="tea-supply" className={classes.list}>
              <div className={classes.title}>{t('visittable.header.tea-supply')}</div>
              <div className={classes.field} style={{ flexBasis: '25%', borderRight: 'none' }}>
                {data.teaSupply ? t('visitdialog.form.tea-supply-yes') : t('visitdialog.form.tea-supply-no')}
              </div>
              <div className={classes.title} style={{ flexBasis: '25%', borderLeft: 'none' }}>
                {t('visittable.header.number-of-tea-supply')}
              </div>
              <div className={classes.field} style={{ flexBasis: '25%' }}>
                {data.numberOfTeaSupply}
              </div>
            </li>
          </>
        )}
      </List>
    </Box>
  );
}
