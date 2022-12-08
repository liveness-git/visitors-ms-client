import { Grid, withStyles } from '@material-ui/core';
import grey from '@material-ui/core/colors/grey';
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab';
import { BoxStyleType } from './TimeBar';

const RangeToggleGroup = withStyles(() => ({
  root: {},
}))(ToggleButtonGroup);

const RangeToggle = withStyles(() => ({
  root: {
    fontSize: '1.1em',
    padding: '2px 10px',
    '&$selected': {
      backgroundColor: grey[300],
      color: grey[600],
      '&:hover': {
        backgroundColor: grey[100],
      },
    },
  },
  selected: {},
}))(ToggleButton);

type TimeBarRangeToggleProps = {
  rangeToggle: BoxStyleType;
  onChangeRangeToggle: (value: BoxStyleType) => void;
};

export function TimeBarRangeToggle(props: TimeBarRangeToggleProps) {
  const { rangeToggle, onChangeRangeToggle } = props;

  const handleChange = (_event: React.MouseEvent<HTMLElement>, value: BoxStyleType) => {
    if (!value) return;
    onChangeRangeToggle(value);
  };

  return (
    <Grid container justify="flex-end">
      <Grid item xs={12} style={{ textAlign: 'right' }}>
        <RangeToggleGroup size="small" value={rangeToggle} exclusive onChange={handleChange}>
          <RangeToggle value="short">
            <>8-20</>
          </RangeToggle>
          <RangeToggle value="long">
            <>1Day</>
          </RangeToggle>
        </RangeToggleGroup>
      </Grid>
    </Grid>
  );
}
