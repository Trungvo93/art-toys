'use client';
import { Dispatch, createContext, useReducer } from 'react';

type InitialStateType = {
  userProfile: any;
  carts: Cart | null;
  badgeCart: Badge;
};
type Action = {
  payload: object;
  type: string;
};
type Quantity = {
  typeSku: string;
  price: number;
  count: number;
};

type DetailCart = {
  productID: string;
  title: string;
  thumbnail: string;
  quantity: any[];
};

type Cart = {
  userID: string;
  carts: DetailCart[];
};
type Badge = {
  counts: number;
};
const initialState: InitialStateType = {
  userProfile: null,
  carts: null,
  badgeCart: { counts: 0 },
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
      return { ...state, carts: null };
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
