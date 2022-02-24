import { useTranslation } from 'react-i18next';

import { makeStyles, createStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Box, List } from '@material-ui/core';

import { RowData } from './DataTable';

export const useRowDataDialogStyles = makeStyles((tableTheme) => {
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

type RowDataBaseDialogProps = {
  open: boolean;
  onClose: () => void;
  data: RowData | null;
  children: React.ReactNode;
};

export function RowDataBaseDialog(props: RowDataBaseDialogProps) {
  const { open, onClose, data, children } = props;

  const { t } = useTranslation();
  const classes = useRowDataDialogStyles();

  const handleCancel = () => {
    onClose();
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth={true} maxWidth="sm" aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">{t('visitdialog.title')}</DialogTitle>
        <DialogContent dividers>
          {!!data && (
            <Box p={2}>
              <List disablePadding={true}>
                <li key="app-time" className={classes.list}>
                  <div className={classes.title}>{t('visittable.header.appt-time')}</div>
                  <div className={classes.field}>{data.apptTime}</div>
                </li>
                <li key="room-name" className={classes.list}>
                  <div className={classes.title}>{t('visittable.header.room-name')}</div>
                  <div className={classes.field}>
                    {data.roomName} {'<'}
                    {data.roomEmail}
                    {'>'}
                  </div>
                </li>
                <li key="reservation-name" className={classes.list}>
                  <div className={classes.title}>{t('visittable.header.reservation-name')}</div>
                  <div className={classes.field}>{data.reservationName}</div>
                </li>
              </List>
            </Box>
          )}
          {children}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel}>{t('visitdialog.button.cancel')}</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}