import { createContext, useReducer } from 'react';

import MySnackbar, { MySnackberAction, mySnackberReducer, MySnackberState } from './MySnackbar';

export type MySnackberContextType = {
  state: MySnackberState;
  dispatch: React.Dispatch<MySnackberAction>;
};

export const MySnackberContext = createContext({} as MySnackberContextType);

type MySnackberProviderProps = {
  children: React.ReactNode;
};

export function MySnackberProvider(props: MySnackberProviderProps) {
  const { children } = props;

  // スナックバーの初期値
  const initialState: MySnackberState = {
    severity: 'info',
    message: '',
    open: false,
  };
  // スナックバーの状態管理
  const [state, dispatch] = useReducer(mySnackberReducer, initialState);

  const handleClose = (_event?: React.SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    dispatch({ type: 'hide' });
  };

  return (
    <>
      <MySnackbar {...state} onClose={handleClose} />
      <MySnackberContext.Provider value={{ state, dispatch }}>{children}</MySnackberContext.Provider>
    </>
  );
}
