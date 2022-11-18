import { makeStyles, createStyles } from '@material-ui/core';
import { EmailAddress } from '_models/User';
import { MyChip } from './MyChip';

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
  propsKey: string;
  data: EmailAddress[];
};

export function AddrBookUserDisplay({ propsKey, data }: AddrBookUserDisplayProps) {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      {data.map((user, i) => (
        <MyChip key={`${propsKey}-${i}`} option={user} />
      ))}
    </div>
  );
}
