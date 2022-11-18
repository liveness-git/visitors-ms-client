import { useTranslation } from 'react-i18next';

import { Box, List, Typography } from '@material-ui/core';

import { makeTableDialogStyle } from '_styles/TableTheme';

import { MyDialog } from '_components/MyDialog';

import { RowDataType } from './DataTableBase';
import { RoomReadFields } from './RoomReadFields';
import { AddrBookUserDisplay } from '_components/AddrBookUserDisplay';
import { UserStatusIconNote } from '_components/UserStatusIconNote';
import ReservationNameField from './ReservationNameField';
import { LastUpdatedField } from './LastUpdatedField';
import { RecurrenceInfo } from './RecurrenceInfo';

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
          {!data?.recurrence && (
            <li key="app-time" className={classes.list}>
              <div className={classes.title}>{t('visittable.header.appt-time')}</div>
              <div className={classes.field}>{data.apptTime}</div>
            </li>
          )}
          {!!data?.recurrence && (
            <li key="app-time" className={classes.list}>
              <div className={classes.title}>{t('visitdialog.notes.recurrence-info')}</div>
              <div className={classes.field}>
                <RecurrenceInfo
                  recurrence={data?.recurrence}
                  start={new Date(data?.startDateTime)}
                  end={new Date(data?.endDateTime)}
                ></RecurrenceInfo>
              </div>
            </li>
          )}
          <li key="reservation-name" className={classes.list}>
            <div className={classes.title}>{t('visittable.header.reservation-name')}</div>
            <div className={classes.field}>
              <ReservationNameField name={data.reservationName} status={data.reservationStatus} />
            </div>
          </li>
        </List>
      </Box>

      <Box px={2} pt={2}>
        <Typography variant="caption" display="block" gutterBottom>
          {t('visitdialog.notes.reply-status')}
          <UserStatusIconNote />
        </Typography>
        <List disablePadding={true}>
          <li key="mailto-required" className={classes.list}>
            <div className={classes.title}>{t('visittable.header.event-mailto-required')}</div>
            <div className={classes.fieldSlim}>
              <AddrBookUserDisplay propsKey="mailto-required" data={data.mailto.required} />
            </div>
          </li>
          <li key="mailto-optional" className={classes.list}>
            <div className={classes.title}>{t('visittable.header.event-mailto-optional')}</div>
            <div className={classes.fieldSlim}>
              <AddrBookUserDisplay propsKey="mailto-optional" data={data.mailto.optional} />
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
            <div className={classes.title}>
              {t('visittable.header.visit-company-name')} /<br />
              {t('visittable.header.visit-company-rep')}
            </div>
            <div className={classes.field}>
              {data.visitCompany.map((co, index) => (
                <>
                  {!!index && <br />}
                  <span>{`${co.name} / ${co.rep}`}</span>
                </>
              ))}
            </div>
          </li>

          <li key="number-of-visitor" className={classes.list}>
            <div className={classes.title}>{t('visittable.header.number-of-visitor')}</div>
            <div className={classes.field} style={{ flexBasis: '25%', borderRight: 'none' }}>
              {data.numberOfVisitor}
            </div>
            <div className={classes.title} style={{ flexBasis: '25%', borderLeft: 'none' }}>
              {t('visittable.header.number-of-employee')}
            </div>
            <div className={classes.field} style={{ flexBasis: '25%' }}>
              {data.numberOfEmployee}
            </div>
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

      <Box px={2} pb={2}>
        <List disablePadding={true}>
          <li key="datetime" className={classes.list}>
            <div className={classes.title}>{t('visitdialog.header.last-updated')}</div>
            <div className={classes.field}>
              <LastUpdatedField datetime={data.lastUpdated} />
            </div>
          </li>
        </List>
      </Box>
    </MyDialog>
  );
}
