import { useTranslation } from 'react-i18next';
import { Chip } from '@material-ui/core';
import _ from 'lodash';

import { nameOfUserStatus } from '_models/User';
import { UserStatusIcon } from './UserStatusIcon';

export const UserStatusIconNote = () => {
  const { t } = useTranslation();

  return (
    <>
      {nameOfUserStatus.map((status, index) => (
        <Chip
          key={index}
          variant="outlined"
          size="small"
          icon={UserStatusIcon({ status: status })}
          label={t(`visitdialog.notes.user-status-${_.kebabCase(status)}`)}
          style={{ fontSize: '0.9em', marginLeft: '5px', border: 'none' }}
        />
      ))}
    </>
  );
};
