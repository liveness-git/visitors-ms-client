import { useTranslation } from 'react-i18next';

import { Box, List } from '@material-ui/core';

import { RowDataType } from './DataTableBase';
import { RowDataBaseDialog, useRowDataDialogStyles } from './RowDataBaseDialog';

type RowDataReadDialogProps = {
  open: boolean;
  onClose: () => void;
  data: RowDataType | null;
};

export function RowDataReadDialog(props: RowDataReadDialogProps) {
  const { open, onClose, data } = props;

  const { t } = useTranslation();
  const classes = useRowDataDialogStyles();

  return (
    <RowDataBaseDialog open={open} onClose={onClose} data={data}>
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
    </RowDataBaseDialog>
  );
}
