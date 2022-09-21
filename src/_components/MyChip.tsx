import { Chip } from '@material-ui/core';

import { EmailAddress } from '_models/User';
import { UserStatusIcon } from './UserStatusIcon';

type MyChipProps = {
  option: EmailAddress;
  [x: string]: any;
};

export const MyChip = (props: MyChipProps) => {
  const { option, ...other } = props;

  return (
    <Chip
      variant="outlined"
      size="small"
      icon={!!option.status ? UserStatusIcon({ status: option.status }) : undefined}
      label={option.name}
      title={option.address}
      style={{ fontSize: '0.9em' }}
      {...other}
    />
  );
};
