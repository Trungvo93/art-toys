'use client';
import { Dispatch, createContext, useReducer } from 'react';
import {
  InitialStateType,
  Action,
  Quantity,
  DetailCart,
  Cart,
  Badge,
} from '../lib/DefiningTypes';

const initialState: InitialStateType = {
  userProfile: null,
  carts: null,
  badgeCart: { counts: 0 },
  keyCart: null,
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
    case 'CARTS_UPDATE_SUCCESS':
      return { ...state, carts: { ...payload } };
    case 'CARTS_REMOVE_SUCCESS':
      return { ...state, carts: null, keyCart: null };
    case 'KEYCART_UPDATE_SUCCESS':
      return { ...state, keyCart: payload };
    case 'BADGE_UPDATE_SUCCESS':
      return { ...state, badgeCart: { ...payload } };

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
