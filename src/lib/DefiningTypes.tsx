export type InitialStateType = {
  userProfile: any;
  carts: Cart | null;
  badgeCart: Badge;
  keyCart: string | null;
};
export type Action = {
  payload: object;
  type: string;
};
export type Quantity = {
  typeSku: string;
  price: number;
  count: number;
};
export type QuantityDetailCart = {
  count: number;
  price: number;
  typeSku: string;
};
export type DetailCart = {
  productID: string;
  title: string;
  thumbnail: string;
  quantity: QuantityDetailCart[];
};

export type Cart = {
  userID: string;
  carts: DetailCart[];
};

export type Badge = {
  counts: number;
};

export type SKUS = {
  type: string;
  price: number;
  count: number;
  stock: number;
};
export type Product = {
  id: string;
  title: string;
  category: string;
  brand: string;
  description: string[];
  preview_url: string[];
  detail: string[];
  skus: SKUS[];
};

export type Banner = {
  id: string;
  src: string;
};

export type PREADDITEM = {
  typeSku: string;
  count: number;
};

export type AvatarType = {
  name: string;
  previewBlob: string;
  fileAvatar: Blob;
};
