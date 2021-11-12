import { Backdrop, CircularProgress, makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    zIndex: theme.zIndex.tooltip + 1,
    color: '#fff',
  },
}));

type SpinnerProps = {
  open: boolean;
};

export function Spinner(props: SpinnerProps) {
  const classes = useStyles();

  return (
    <Backdrop className={classes.root} open={props.open}>
      <CircularProgress color="inherit" />
    </Backdrop>
  );
}
