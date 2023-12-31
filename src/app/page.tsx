import BannerPage from '@/components/banner/BannerPage';
import { database } from '../../firebase/firebaseConfig';

import { ref, get } from 'firebase/database';
import { Suspense } from 'react';
import LoadingBanner from '@/components/banner/LoadingBanner';
import LoadingNewArrivalPage from '@/components/products/new-arrival/LoadingNewArrival';
import NewArrivalPage from '@/components/products/new-arrival/NewArrivalPage';
import { Product, Banner } from '@/lib/DefiningTypes';

async function getBanner() {
  const bannerRef = ref(database, 'banners');
  let result: Banner[] | null = null;
  await get(bannerRef)
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

  // await new Promise((resolve) => setTimeout(resolve, 2000));
  return result;
}

async function getProducts() {
  const productsRef = ref(database, 'products');
  let result: Product[] | null = null;
  await get(productsRef)
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

export default async function Page() {
  const dataBanner: Banner[] | null = await getBanner();
  const dataProducts: Product[] | null = await getProducts();
  return (
    <main className='p-4 '>
      <Suspense fallback={<LoadingBanner />}>
        <BannerPage data={dataBanner} />
      </Suspense>
      <Suspense fallback={<LoadingNewArrivalPage />}>
        <NewArrivalPage data={dataProducts} />
      </Suspense>
    </main>
  );
}
