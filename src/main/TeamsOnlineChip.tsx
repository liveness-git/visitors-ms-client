import { useTranslation } from 'react-i18next';

import { Chip } from '@material-ui/core';
import VoiceChatIcon from '@material-ui/icons/VoiceChat';

export const TeamsOnlineChip = () => {
  const { t } = useTranslation();

  return (
    <Chip
      size="small"
      icon={<VoiceChatIcon style={{ color: 'white' }} />}
      label={t('visitdialog.form.with-teams')}
      style={{ color: 'white', backgroundColor: '#6e75c9' }}
    />
  );
};
