import { createTheme, makeStyles } from '@material-ui/core';
import { grey } from '@material-ui/core/colors';
import { defaultPrimary } from './Theme';

export const tableTheme = createTheme({
  palette: {
    primary: {
      main: grey[300],
    },
    secondary: {
      main: defaultPrimary.main,
    },
  },
  props: {
    MuiTableRow: {
      // hover: true,
      // selected: true,
    },
  },
  overrides: {
    MuiTable: {
      root: {
        borderCollapse: 'separate',
      },
    },
  },
});

export const makeTableDialogStyle = () => {
  const border = 'thin solid rgba(0, 0, 0, 0.12)';
  return makeStyles((tableTheme) => ({
    list: {
      display: 'flex',
      // flexFlow: 'row-wrap',
      // width: '100%',
      '&:first-child > div': {
        borderTop: border,
      },
    },
    title: {
      boxSizing: 'border-box',
      flexBasis: '25%',
      padding: '0.7em',
      backgroundColor: tableTheme.palette.primary.light,
      borderLeft: border,
      borderBottom: border,
    },
    field: {
      boxSizing: 'border-box',
      flexBasis: '75%',
      padding: '0.7em',
      borderRight: border,
      borderBottom: border,
      whiteSpace: 'pre-wrap',
    },
    fieldSlim: {
      boxSizing: 'border-box',
      flexBasis: '75%',
      padding: '0.2em',
      borderRight: border,
      borderBottom: border,
      whiteSpace: 'pre-wrap',
    },
    bottomLine: {
      borderBottom: border,
    },
  }));
};
