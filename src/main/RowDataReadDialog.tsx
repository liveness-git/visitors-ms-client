import { useTranslation } from 'react-i18next';

import { Box, List } from '@material-ui/core';

import { RowDataType } from './DataTableBase';
import { RowDataBaseDialog, useRowDataDialogStyles } from './RowDataBaseDialog';
import { RoomReadFields } from './RoomReadFields';

type RowDataReadDialogProps = {
  open: boolean;
  onClose: () => void;
  data: RowDataType;
};

export function RowDataReadDialog(props: RowDataReadDialogProps) {
  const { open, onClose, data } = props;

  const { t } = useTranslation();
  const classes = useRowDataDialogStyles();

  return (
    <RowDataBaseDialog open={open} onClose={onClose} data={data}>
      <Box px={2} pt={2}>
        <List disablePadding={true}>
          <li key="event-subject" className={classes.list}>
            <div className={classes.title}>{t('visittable.header.event-subject')}</div>
            <div className={classes.field}>{data.subject}</div>
          </li>
          <li key="app-time" className={classes.list}>
            <div className={classes.title}>{t('visittable.header.appt-time')}</div>
            <div className={classes.field}>{data.apptTime}</div>
          </li>
          <li key="reservation-name" className={classes.list}>
            <div className={classes.title}>{t('visittable.header.reservation-name')}</div>
            <div className={classes.field}>{data.reservationName}</div>
          </li>
        </List>
      </Box>

      {Object.keys(data.resourcies).map((roomId) => {
        return <RoomReadFields data={data.resourcies[roomId]} />;
      })}

      <Box p={2}>
        <List disablePadding={true}>
          <li key="visit-company" className={classes.list}>
            <div className={classes.title}>{t('visittable.header.visit-company')}</div>
            <div className={classes.field}>{data.visitCompany}</div>
          </li>
          <li key="visitor-name" className={classes.list}>
            <div className={classes.title}>{t('visittable.header.visitor-name')}</div>
            <div className={classes.field}>{data.visitorName}</div>
          </li>
          <li key="comment" className={classes.list}>
            <div className={classes.title}>{t('visittable.header.comment')}</div>
            <div className={classes.field}>{data.comment}</div>
          </li>
          <li key="contact-addr" className={classes.list}>
            <div className={classes.title}>{t('visittable.header.contact-addr')}</div>
            <div className={classes.field}>{data.contactAddr}</div>
          </li>
        </List>
      </Box>
    </RowDataBaseDialog>
  );
}
