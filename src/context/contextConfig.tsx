'use client';
import { Dispatch, createContext, useReducer } from 'react';

type InitialStateType = {
  userProfile: any;
};
type Action = {
  payload: object;
  type: string;
};
const initialState: InitialStateType = {
  userProfile: undefined,
};
const reducer = (state: any, action: Action) => {
  const { payload, type } = action;
  switch (type) {
    case 'LOGIN_SUCCESS':
      return { ...state, userProfile: { ...payload } };
    case 'LOGOUT_SUCCESS':
      return { ...state, userProfile: undefined };
    case 'USER_UPDATE_SUCCESS':
      return { ...state, userProfile: { ...payload } };
    default:
      return state;
  }
};

export const AppContext = createContext<{
  state: InitialStateType;
  dispatch: Dispatch<Action>;
}>({ state: initialState, dispatch: () => null });

export const AppContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};
