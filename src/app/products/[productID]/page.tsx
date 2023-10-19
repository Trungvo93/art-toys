// 'use client';
import { headers } from 'next/headers';
import {
  ref,
  get,
  query,
  orderByChild,
  equalTo,
  limitToFirst,
} from 'firebase/database';
import { database } from '../../../../firebase/firebaseConfig';
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
  const domain = headersList.get('x-forwarded-host') || '';
  const protocol = headersList.get('x-forwarded-proto') || '';
  const pathname = headersList.get('x-invoke-path') || '';
  const productID = pathname.slice(10);
  const productsRef = ref(database, 'products');
  const productQuery = query(
    productsRef,
    orderByChild('id'),
    equalTo(productID)
  );
  let result: Product[] | null = null;
  await get(productQuery)
    .then((snapshot) => {
      if (snapshot.exists()) {
        console.log(snapshot.val());
        result = snapshot.val();
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
  const dataProduct: Product[] | null = await getProductItem();
  console.log(dataProduct);

  return (
    <div>
      <h1>Current pathname: {dataProduct && dataProduct[0]['title']}</h1>
    </div>
  );
}
