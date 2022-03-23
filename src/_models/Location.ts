import { RouteComponentProps } from 'react-router-dom';

export type Location = {
  id: string;
  name: string;
  url: string;
  sort: string;
};
export type LocationParams = { location: string };
export type PageProps = {} & RouteComponentProps<LocationParams>;
