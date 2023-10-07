import BannerPage from '@/components/banner/Banner';
import { database } from '../../firebase/firebaseConfig';
import { ref, onValue, get } from 'firebase/database';
import { Suspense } from 'react';
type Banner = {
  id: string;
  src: string;
};
async function getData() {
  const bannerRef = ref(database, 'banner');
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

  // await new Promise((resolve) => setTimeout(resolve, 1000));
  return result;
}
export default async function Page() {
  const data: Banner[] | null = await getData();
  return (
    <main>
      <Suspense fallback={<p>Loading feed...</p>}>
        <BannerPage data={data} />
      </Suspense>
    </main>
  );
}
