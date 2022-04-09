import { useTranslation } from 'react-i18next';
import { Box, List } from '@material-ui/core';
import { ResourciesReadOnly, VisitorInfoResourcies } from '_models/VisitorInfo';
import { useRowDataDialogStyles } from './RowDataBaseDialog';

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
};

export function RoomReadFields(props: RoomReadFieldsProps) {
  const { data } = props;

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
        <li key="tea-supply" className={classes.list}>
          <div className={classes.title}>{t('visittable.header.tea-supply')}</div>
          <div className={classes.field}>{data.teaSupply ? t('visitdialog.form.tea-supply-yes') : t('visitdialog.form.tea-supply-no')}</div>
        </li>
        <li key="number-of-visitor" className={classes.list}>
          <div className={classes.title}>{t('visittable.header.number-of-visitor')}</div>
          <div className={classes.field}>{data.numberOfVisitor}</div>
        </li>
        <li key="number-of-employee" className={classes.list}>
          <div className={classes.title}>{t('visittable.header.number-of-employee')}</div>
          <div className={classes.field}>{data.numberOfEmployee}</div>
        </li>
      </List>
    </Box>
  );
}
