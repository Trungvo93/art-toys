import {
  ref,
  get,
  query,
  orderByChild,
  equalTo,
  limitToFirst,
  orderByValue,
  orderByKey,
} from 'firebase/database';
import { database } from '../../../../firebase/firebaseConfig';
import { Suspense } from 'react';

import ProductItemPage from '@/components/products/product/page';
import { isArray } from '@nextui-org/shared-utils';
type SKUS = {
  type: string;
  price: number;
  count: number;
  stock: number;
};
type Product = {
  id: string;
  title: string;
  category: string;
  brand: string;
  description: string;
  preview_url: string[];
  detail: string[];
  skus: SKUS[];
};
async function getProductItem(productID: string) {
  const productsRef = ref(database, 'products');
  const productQuery = query(
    productsRef,
    orderByChild('id'),
    equalTo(productID)
  );
  let result: Product | null = null;
  await get(productQuery)
    .then((snapshot) => {
      if (snapshot.exists()) {
        if (isArray(snapshot.val())) {
          result = snapshot.val()?.filter((value: Product) => value)[0];
        } else {
          result = snapshot.val()[Object.keys(snapshot.val())[0]];
        }
      } else {
        console.log('No data available');
      }
    })
    .catch((error) => {
      console.error(error);
    });
  return result;
}
export default async function ProductPage({
  params,
}: {
  params: { productID: string };
}) {
  const dataProduct: Product | null = await getProductItem(params.productID);

  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <ProductItemPage data={dataProduct} />
      </Suspense>
    </div>
  );
}
