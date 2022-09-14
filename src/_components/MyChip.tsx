import { Chip, Theme, useTheme } from '@material-ui/core';
import DoneIcon from '@material-ui/icons/Done';
import CloseIcon from '@material-ui/icons/Close';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';

import { EmailAddress } from '_models/User';

type MyChipProps = {
  option: EmailAddress;
  [x: string]: any;
};

const iconFontSize = '1.3em';

const icon = (option: EmailAddress, theme: Theme) => {
  console.log('icon', option.name);
  if (option.status === 'none') {
    return <HelpOutlineIcon style={{ color: theme.palette.warning.main, fontSize: iconFontSize }} />;
  } else if (option.status === 'accepted') {
    return <DoneIcon style={{ color: theme.palette.success.main, fontSize: iconFontSize }} />;
  } else {
    return <CloseIcon style={{ color: theme.palette.error.main, fontSize: iconFontSize }} />;
  }
};

function MyChip(props: MyChipProps) {
  const { option, ...other } = props;
  const theme = useTheme();

  return (
    <Chip
      variant="outlined"
      size="small"
      icon={!!option.status ? icon(option, theme) : undefined}
      label={option.name}
      title={option.address}
      style={{ fontSize: '0.9em' }}
      {...other}
    />
  );
}

export default MyChip;
