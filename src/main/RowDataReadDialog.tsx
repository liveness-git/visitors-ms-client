import { useTranslation } from 'react-i18next';

import { Box, List } from '@material-ui/core';

import { makeTableDialogStyle } from '_styles/TableTheme';

import { MyDialog } from '_components/MyDialog';

import { RowDataType } from './DataTableBase';
import { RoomReadFields } from './RoomReadFields';
import { AddrBookUserDisplay } from '_components/AddrBookUserDisplay';

const useRowDataDialogStyles = makeTableDialogStyle();

type RowDataReadDialogProps = {
  open: boolean;
  onClose: () => void;
  data: RowDataType;
};

export function RowDataReadDialog(props: RowDataReadDialogProps) {
  const { open, onClose, data } = props;

  const { t } = useTranslation();
  const classes = useRowDataDialogStyles();

  // 会議メンバーではない場合、詳細表示NG
  if (!data.isAttendees) {
    return (
      <MyDialog open={open} onClose={onClose} title={t('visitdialog.title')}>
        {t('common.msg.authority-error')}
      </MyDialog>
    );
  }

  return (
    <MyDialog open={open} onClose={onClose} title={t('visitdialog.title')}>
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

      <Box px={2} pt={2}>
        <List disablePadding={true}>
          <li key="mailto-required" className={classes.list}>
            <div className={classes.title}>{t('visittable.header.event-mailto-required')}</div>
            <div className={classes.fieldSlim}>
              <AddrBookUserDisplay key="mailto-required" data={data.mailto.required} />
            </div>
          </li>
          <li key="mailto-optional" className={classes.list}>
            <div className={classes.title}>{t('visittable.header.event-mailto-optional')}</div>
            <div className={classes.fieldSlim}>
              <AddrBookUserDisplay key="mailto-optional" data={data.mailto.optional} />
            </div>
          </li>
        </List>
      </Box>

      {Object.keys(data.resourcies).map((roomId) => {
        return <RoomReadFields key={roomId} data={data.resourcies[roomId]} /*hiddenTeaSupply={data.isMSMultipleLocations}*/ />;
      })}

      <Box px={2} pt={2} style={data.usageRange === 'inside' ? { display: 'none' } : undefined}>
        <List disablePadding={true}>
          <li key="visit-company" className={classes.list}>
            <div className={classes.title}>{t('visittable.header.visit-company')}</div>
            <div className={classes.field}>{data.visitCompany}</div>
          </li>
          <li key="visitor-name" className={classes.list}>
            <div className={classes.title}>{t('visittable.header.visitor-name')}</div>
            <div className={classes.field}>{data.visitorName}</div>
          </li>
        </List>
      </Box>

      <Box p={2} pt={2}>
        <List disablePadding={true}>
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
    </MyDialog>
  );
}
