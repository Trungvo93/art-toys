'use client';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import { database } from '../../../firebase/firebaseConfig';
import { ref, onValue } from 'firebase/database';
import { Button, Image } from '@nextui-org/react';
import { useState, useEffect } from 'react';
type Banner = {
  id: string;
  src: string;
};
export default function BannerPage(props: { data: Banner[] | null }) {
  const [data, setData] = useState<Banner[] | null>();
  useEffect(() => {
    const bannerRef = ref(database, 'banner');
    onValue(bannerRef, (snapshot) => {
      const data = snapshot.val();
      if (!!data) {
        setData(data);
      } else {
        console.log('Data not found');
        setData(null);
      }
    });
  }, []);
  return (
    <div className='p-4'>
      {/* <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={50}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 2500 }}>
        <SwiperSlide
          className='cursor-pointer'
          onClick={() => {
            console.log('click ne');
          }}>
          <Image
            src={data ? data[0].src : ''}
            alt='NextUI hero Image'
          />
        </SwiperSlide>
        <SwiperSlide className='cursor-pointer'>
          <Image
            src={data ? data[1].src : ''}
            alt='NextUI hero Image'
          />
        </SwiperSlide>
      </Swiper> */}
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={50}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 2500 }}>
        <SwiperSlide
          className='cursor-pointer'
          onClick={() => {
            console.log('click ne');
          }}>
          <Image
            src={props.data ? props.data[0].src : ''}
            alt='NextUI hero Image'
          />
        </SwiperSlide>
        <SwiperSlide className='cursor-pointer'>
          <Image
            src={props.data ? props.data[1].src : ''}
            alt='NextUI hero Image'
          />
        </SwiperSlide>
      </Swiper>
      <Button
        onClick={() => {
          console.log(data);
        }}>
        click
      </Button>
    </div>
  );
}
