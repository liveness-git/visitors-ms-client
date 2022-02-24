import { useTranslation } from 'react-i18next';

import { makeStyles, createStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Box, List } from '@material-ui/core';

import { RowData } from './DataTable';

const useStyles = makeStyles((tableTheme) => {
  const border = 'thin solid rgba(0, 0, 0, 0.12)';

  return createStyles({
    list: {
      display: 'flex',
      flexFlow: 'row-wrap',
      width: '100%',
      '&:first-child div': {
        borderTop: border,
      },
    },
    title: {
      boxSizing: 'border-box',
      flexBasis: '25%',
      padding: '0.7em',
      backgroundColor: tableTheme.palette.primary.light,
      borderLeft: border,
      borderBottom: border,
    },
    field: {
      boxSizing: 'border-box',
      flexBasis: '75%',
      padding: '0.7em',
      borderRight: border,
      borderBottom: border,
      whiteSpace: 'pre-wrap',
    },
  });
});

type RowDataReadDialogProps = {
  open: boolean;
  onClose: () => void;
  data: RowData | null;
};

export function RowDataReadDialog(props: RowDataReadDialogProps) {
  const { open, onClose, data } = props;

  const { t } = useTranslation();
  const classes = useStyles();

  const handleCancel = () => {
    onClose();
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth={true} maxWidth="sm" aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">{t('visitdialog.title')}</DialogTitle>
        <DialogContent dividers>
          <Box p={2}>
            <List disablePadding={true}>
              <li key="app-time" className={classes.list}>
                <div className={classes.title}>{t('visittable.header.appt-time')}</div>
                <div className={classes.field}>{data?.apptTime}</div>
              </li>
              <li key="room-name" className={classes.list}>
                <div className={classes.title}>{t('visittable.header.room-name')}</div>
                <div className={classes.field}>
                  {data?.roomName} {'<'}
                  {data?.roomEmail}
                  {'>'}
                </div>
              </li>
              <li key="reservation-name" className={classes.list}>
                <div className={classes.title}>{t('visittable.header.reservation-name')}</div>
                <div className={classes.field}>{data?.reservationName}</div>
              </li>
            </List>
          </Box>

          <Box p={2}>
            <List disablePadding={true}>
              <li key="visit-company" className={classes.list}>
                <div className={classes.title}>{t('visittable.header.visit-company')}</div>
                <div className={classes.field}>{data?.visitCompany}</div>
              </li>
              <li key="visitor-name" className={classes.list}>
                <div className={classes.title}>{t('visittable.header.visitor-name')}</div>
                <div className={classes.field}>{data?.visitorName}</div>
              </li>
              <li key="tea-supply" className={classes.list}>
                <div className={classes.title}>{t('visittable.header.tea-supply')}</div>
                <div className={classes.field}>{data?.teaSupply ? t('visitdialog.form.tea-supply-yes') : t('visitdialog.form.tea-supply-no')}</div>
              </li>
              <li key="number-of-visitor" className={classes.list}>
                <div className={classes.title}>{t('visittable.header.number-of-visitor')}</div>
                <div className={classes.field}>{data?.numberOfVisitor}</div>
              </li>
              <li key="number-of-employee" className={classes.list}>
                <div className={classes.title}>{t('visittable.header.number-of-employee')}</div>
                <div className={classes.field}>{data?.numberOfEmployee}</div>
              </li>
              <li key="comment" className={classes.list}>
                <div className={classes.title}>{t('visittable.header.comment')}</div>
                <div className={classes.field}>{data?.comment}</div>
              </li>
              <li key="contact-addr" className={classes.list}>
                <div className={classes.title}>{t('visittable.header.contact-addr')}</div>
                <div className={classes.field}>{data?.contactAddr}</div>
              </li>
            </List>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel}>{t('visitdialog.button.cancel')}</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
