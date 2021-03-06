import { ThemeProvider } from '@material-ui/core/styles';

import { tableTheme } from '_styles/TableTheme';
import { Spinner } from '_components/Spinner';

import { InputFields, RowDataInputDialog } from './RowDataInputDialog';

export type DataDialogState = {
  mode: 'rowData' | 'addData';
  inputOpen: boolean;
};

export type DataDialogAction = {
  type: 'inputOpen' | 'addDataOpen' | 'inputClose';
};

export const dataDialogReducer = (state: DataDialogState, action: DataDialogAction): DataDialogState => {
  switch (action.type) {
    case 'inputOpen':
      return { mode: 'rowData', inputOpen: true };
    case 'addDataOpen':
      return { mode: 'addData', inputOpen: true };
    case 'inputClose':
      return { ...state, inputOpen: false };
    default:
      return state;
  }
};

type DataTableBaseProps<RowData> = {
  inputFields: InputFields<RowData>;
  currentRow: RowData | null;
  dataDialogHook: {
    state: DataDialogState;
    dispatch: React.Dispatch<DataDialogAction>;
  };
  isLoading: boolean;
  reload: () => void;
  children: React.ReactNode;
};

export function DataTableBase<RowData>(props: DataTableBaseProps<RowData>) {
  const { inputFields, dataDialogHook, isLoading, reload, currentRow, children } = props;

  // ダイアログを閉じる(input)
  const handleInputDialogClose = async () => {
    dataDialogHook.dispatch({ type: 'inputClose' });
  };

  return (
    <ThemeProvider theme={tableTheme}>
      <Spinner open={isLoading} />
      {children}
      <RowDataInputDialog<RowData>
        inputFields={inputFields}
        open={dataDialogHook.state.inputOpen}
        onClose={handleInputDialogClose}
        data={dataDialogHook.state.mode === 'addData' ? null : currentRow}
        reload={reload}
      />
    </ThemeProvider>
  );
}
