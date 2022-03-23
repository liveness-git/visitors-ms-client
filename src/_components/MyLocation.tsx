import { useState } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { FormControl, MenuItem, Select } from '@material-ui/core';

import { Location, LocationParams } from '_models/Location';
import { useLoadData } from '_utils/useLoadData';

export function MyLocation() {
  // ロケーション一覧取得
  const [{ data: locations }] = useLoadData<Location[]>(`/location/choices`, []);

  const history = useHistory();
  const match = useRouteMatch<LocationParams>();

  // ロケーションの状態
  const [selected, setselected] = useState<string>(match.params.location);
  const handleOnChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setselected(event.target.value as string);
    const url = match.path.replace(/:location/i, event.target.value as string);
    history.push(url);
  };

  if (!locations || locations.length === 0) {
    return <></>;
  }

  return (
    <FormControl color="primary" margin="dense" size="small">
      <Select style={{ color: 'white' }} inputProps={{ disableUnderline: true }} value={selected} onChange={handleOnChange}>
        {locations.map((data) => {
          return (
            <MenuItem key={data.url} value={data.url}>
              {data.name}
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
}
