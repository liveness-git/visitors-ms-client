import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import { grey, purple } from '@material-ui/core/colors';

import { VisitorInfo, VisitorInfoReadOnly } from '_models/VisitorInfo';

import { Spinner } from '_components/Spinner';

import { RowDataInputDialog } from './RowDataInputDialog';
import { RowDataReadDialog } from './RowDataReadDialog';

export const tableTheme = createTheme({
  palette: {
    primary: {
      main: grey[300],
    },
    secondary: {
      main: purple[500],
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

export type RowDataType = VisitorInfo & VisitorInfoReadOnly;

export type DataDialogState = {
  mode: 'rowData' | 'addData';
  inputOpen: boolean;
  readOpen: boolean;
};

export type DataDialogAction = {
  type: 'inputOpen' | 'addDataOpen' | 'inputClose' | 'readOpen' | 'readClose';
};

export const dataDialogReducer = (state: DataDialogState, action: DataDialogAction): DataDialogState => {
  switch (action.type) {
    case 'inputOpen':
      return { mode: 'rowData', inputOpen: true, readOpen: false };
    case 'addDataOpen':
      return { mode: 'addData', inputOpen: true, readOpen: false };
    case 'inputClose':
      return { ...state, inputOpen: false };
    case 'readOpen':
      return { mode: 'rowData', inputOpen: false, readOpen: true };
    case 'readClose':
      return { ...state, readOpen: false };
    default:
      return state;
  }
};

type DataTableBaseProps = {
  currentRow: RowDataType | null;
  dataDialogHook: {
    state: DataDialogState;
    dispatch: React.Dispatch<DataDialogAction>;
  };
  isLoading: boolean;
  reload: () => void;
  children: React.ReactNode;
};

export function DataTableBase(props: DataTableBaseProps) {
  const { dataDialogHook, isLoading, reload, currentRow, children } = props;

  // ダイアログを閉じる(input)
  const handleInputDialogClose = async () => {
    dataDialogHook.dispatch({ type: 'inputClose' });
  };
  // ダイアログを閉じる(read)
  const handleReadDialogClose = async () => {
    dataDialogHook.dispatch({ type: 'readClose' });
  };

  return (
    <ThemeProvider theme={tableTheme}>
      <Spinner open={isLoading} />
      {children}
      <RowDataInputDialog
        open={dataDialogHook.state.inputOpen}
        onClose={handleInputDialogClose}
        data={dataDialogHook.state.mode === 'addData' ? null : currentRow}
        reload={reload}
      />
      {!!currentRow && <RowDataReadDialog open={dataDialogHook.state.readOpen} onClose={handleReadDialogClose} data={currentRow} />}
    </ThemeProvider>
  );
}
