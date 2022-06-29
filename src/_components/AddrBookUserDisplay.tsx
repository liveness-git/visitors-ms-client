import { Chip, makeStyles, createStyles } from '@material-ui/core';
import { EmailAddress } from '_models/User';

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      display: 'flex',
      // justifyContent: 'center',
      flexWrap: 'wrap',
      '& > *': {
        margin: theme.spacing(0.5),
      },
    },
  })
);

type AddrBookUserDisplayProps = {
  key: string;
  data: EmailAddress[];
};

export function AddrBookUserDisplay({ key, data }: AddrBookUserDisplayProps) {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      {data.map((user, i) => (
        <Chip key={`${key}-${i}`} label={user.name} />
      ))}
    </div>
  );
}
