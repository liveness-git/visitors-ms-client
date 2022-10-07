import { ThemeProvider } from '@material-ui/core/styles';

import { VisitorInfo, VisitorInfoReadOnly } from '_models/VisitorInfo';
import { tableTheme } from '_styles/TableTheme';
import { Spinner } from '_components/Spinner';

import { AddDefaultType, RowDataInputDialog } from './RowDataInputDialog';
import { RowDataReadDialog } from './RowDataReadDialog';
import { RecurrenceConfirmDialog } from './RecurrenceConfirmDialog';

export type RowDataType = VisitorInfo & VisitorInfoReadOnly;

export type DataDialogState = {
  mode: 'rowData' | 'addData';
  inputOpen: boolean;
  readOpen: boolean;
  addDefault?: AddDefaultType;
  recConfOpen?: boolean;
};

export type DataDialogAction =
  | {
      type: 'inputOpen' | 'readOpen' | 'inputClose' | 'readClose' | 'recConfOpen' | 'recConfClose' | 'recConfCancel';
    }
  | { type: 'addDataOpen'; addDefault?: AddDefaultType };

export const dataDialogReducer = (state: DataDialogState, action: DataDialogAction): DataDialogState => {
  switch (action.type) {
    case 'inputOpen':
      return { mode: 'rowData', inputOpen: true, readOpen: false };
    case 'addDataOpen':
      return { mode: 'addData', inputOpen: true, readOpen: false, addDefault: action.addDefault };
    case 'inputClose':
      return { ...state, inputOpen: false };
    case 'readOpen':
      return { mode: 'rowData', inputOpen: false, readOpen: true };
    case 'readClose':
      return { ...state, readOpen: false };
    case 'recConfOpen':
      return { ...state, recConfOpen: true };
    case 'recConfClose':
      return { ...state, recConfOpen: false };
    case 'recConfCancel':
      return { ...state, recConfOpen: false, inputOpen: false, readOpen: false };
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
  onRecConfClose?: (isCancel: boolean, master?: RowDataType) => void;
};

export function DataTableBase(props: DataTableBaseProps) {
  const { dataDialogHook, isLoading, reload, currentRow, children, onRecConfClose } = props;

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
        open={dataDialogHook.state.inputOpen && !dataDialogHook.state.recConfOpen}
        onClose={handleInputDialogClose}
        data={dataDialogHook.state.mode === 'addData' ? null : currentRow}
        reload={reload}
        addDefault={dataDialogHook.state.addDefault}
      />
      {!!currentRow && (
        <RowDataReadDialog
          open={dataDialogHook.state.readOpen && !dataDialogHook.state.recConfOpen}
          onClose={handleReadDialogClose}
          data={currentRow}
        />
      )}
      {!!currentRow && !!currentRow.seriesMasterId && !!onRecConfClose && (
        <RecurrenceConfirmDialog open={!!dataDialogHook.state.recConfOpen} seriesMasterId={currentRow.seriesMasterId} onClose={onRecConfClose} />
      )}
    </ThemeProvider>
  );
}
