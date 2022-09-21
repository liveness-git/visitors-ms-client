import { useTheme } from '@material-ui/core';
import DoneIcon from '@material-ui/icons/Done';
import CloseIcon from '@material-ui/icons/Close';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';

import { UserStatus } from '_models/User';

type UserStatusIconProps = {
  status: UserStatus;
};

const iconFontSize = '1.3em';

export const UserStatusIcon = (props: UserStatusIconProps) => {
  const { status } = props;

  const theme = useTheme();

  // console.log('icon', status); //TODO:入力系の時重複レンダリングが発生。要調査

  if (status === 'none') {
    return <HelpOutlineIcon style={{ color: theme.palette.text.secondary, fontSize: iconFontSize }} />;
  } else if (status === 'tentativelyAccepted') {
    return <DoneIcon style={{ color: theme.palette.warning.main, fontSize: iconFontSize }} />;
  } else if (status === 'accepted') {
    return <DoneIcon style={{ color: theme.palette.success.main, fontSize: iconFontSize }} />;
  } else {
    return <CloseIcon style={{ color: theme.palette.error.main, fontSize: iconFontSize }} />;
  }
};
