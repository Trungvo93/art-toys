// 'use client';
import { headers } from 'next/headers';
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
type Product = {
  id: string;
  title: string;
  price: number;
  category: string;
  brand: string;
  description: string;
  preview_url: string[];
  detail: string[];
  quantity: number;
};
async function getProductItem() {
  const headersList = headers();
  const pathname = headersList.get('x-invoke-path') || '';
  const productID = pathname.slice(10);
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
export default async function ProductPage() {
  const dataProduct: Product | null = await getProductItem();
  const headersList = headers();
  const pathname = headersList.get('x-invoke-path') || '';
  const productID = pathname.slice(10);
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <ProductItemPage
          data={dataProduct}
          test={productID}
        />
      </Suspense>
    </div>
  );
}
