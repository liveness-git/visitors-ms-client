import SyncIcon from '@material-ui/icons/Sync';
import SyncDisabledIcon from '@material-ui/icons/SyncDisabled';

import { GraphApiEventType } from '_models/VisitorInfo';

type EventTypeIconProps = {
  type: GraphApiEventType;
};

const style = { fontSize: '1.2em', marginLeft: '3px', marginRight: '3px', verticalAlign: 'text-bottom', color: 'gray' };

export const EventTypeIcon = (props: EventTypeIconProps) => {
  const { type } = props;

  switch (type) {
    case 'occurrence':
      return <SyncIcon style={style} />;
    case 'exception':
      return <SyncDisabledIcon style={style} />;
    case 'seriesMaster':
    case 'singleInstance':
    default:
      return <></>;
  }
};
