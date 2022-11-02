import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Box, FormControlLabel, Radio, RadioGroup } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import { RowDataType } from './DataTableBase';
import { get } from '_utils/Http';

type AnswerType = 'instances' | 'master';

type RecurrenceConfirmDialogProps = {
  open: boolean;
  seriesMasterId: string;
  onClose: (isCancel: boolean, master?: RowDataType) => void;
};

export function RecurrenceConfirmDialog(props: RecurrenceConfirmDialogProps) {
  const { open, seriesMasterId, onClose } = props;

  const { t } = useTranslation();

  const [answer, setAnswer] = useState<AnswerType>('instances');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAnswer(event.target.value as AnswerType);
  };

  const handleOkClose = async () => {
    if (answer === 'master') {
      const result = await get<RowDataType>(`/event/visitInfo/${seriesMasterId}`);
      console.log('seriesMaster', result.parsedBody); // TODO: debug
      onClose(false, result.parsedBody);
    } else {
      onClose(false);
    }
  };
  const handleCancelClose = () => {
    onClose(true);
  };

  return (
    <div>
      <Dialog open={open} onClose={handleCancelClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        {/* <DialogTitle id="alert-dialog-title">{t('visitorinfoform.recurrence-confirm-title')}</DialogTitle> */}
        <DialogContent>
          <DialogContentText id="alert-dialog-description">{t('visitorinfoform.recurrence-confirm-message')}</DialogContentText>
          <Box>
            <RadioGroup aria-label="gender" name="gender1" value={answer} onChange={handleChange}>
              <FormControlLabel value="instances" control={<Radio />} label={t('visitorinfoform.recurrence-radio-instances')} />
              <FormControlLabel value="master" control={<Radio />} label={t('visitorinfoform.recurrence-radio-master')} />
            </RadioGroup>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleOkClose} color="secondary">
            OK
          </Button>
          <Button onClick={handleCancelClose} color="secondary" autoFocus>
            CANCEL
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
