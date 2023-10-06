import BannerPage from '@/components/banner/Banner';
import { database } from '../../firebase/firebaseConfig';
import { ref, onValue } from 'firebase/database';
type Banner = {
  id: string;
  src: string;
};
async function getData() {
  const bannerRef = ref(database, 'banner');
  let result: Banner[] | null = null;
  await onValue(bannerRef, (snapshot) => {
    const data = snapshot.val();
    if (!!data) {
      result = data;
    } else {
      console.log('Data not found');
    }
  });
  return result;
}
export default async function Page() {
  const data: Banner[] | null = await getData();
  return <main>{data ? <BannerPage data={data} /> : ''}</main>;
}
