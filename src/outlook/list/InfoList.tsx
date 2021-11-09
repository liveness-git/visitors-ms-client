import { createStyles, makeStyles } from '@material-ui/core/styles';
import { List, ListItem, ListItemText, ListSubheader } from '@material-ui/core';

import { VisitorInfoMs, VisitorInfoPersonal, VisitorInfoFront } from '_components/VisitorInfo';
import { useLoadData } from '_components/utils/useLoadData';
import { Spinner } from '_components/utils/Spinner';

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      width: '100%',
      position: 'relative',
      overflow: 'auto',
      maxHeight: 500,
      marginTop: 10,
    },
    listSubheader: {
      color: theme.palette.primary.contrastText,
      backgroundColor: theme.palette.primary.main,
      fontSize: '1.2rem',
    },
    ul: {
      padding: 0,
    },
  })
);

type VisitorInfo = VisitorInfoMs & VisitorInfoPersonal & VisitorInfoFront;

type RowData = {
  date: string;
  list: VisitorInfo[];
};

export function InfoList() {
  const classes = useStyles();

  // データ取得
  const [{ data, isLoading }] = useLoadData<RowData[]>('http://localhost:3000/test/testdata5.json', []);

  return (
    <>
      <Spinner open={isLoading} />
      <List className={classes.root} subheader={<li />}>
        {data!.map((items, sectionId) => (
          <li key={`section-${sectionId}`}>
            <ul className={classes.ul}>
              <ListSubheader className={classes.listSubheader}>{`${items.date}`}</ListSubheader>
              {items.list.map((item, itemId) => (
                <ListItem key={`item-${sectionId}-${itemId}`}>
                  <ListItemText primary={`${item.apptTime}  ${item.visitCompany}`} />
                </ListItem>
              ))}
            </ul>
          </li>
        ))}
      </List>
    </>
  );
}
