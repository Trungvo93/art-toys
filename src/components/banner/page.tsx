'use client';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

import Image from 'next/image';
type Banner = {
  id: string;
  src: string;
};
export default function BannerPage(props: { data: Banner[] | null }) {
  const { data } = props;

  return (
    <div>
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={50}
        slidesPerView={1}
        navigation
        loop={true}
        pagination={{ clickable: true, dynamicBullets: true }}
        autoplay={{ delay: 2500 }}
        className=' overflow-hidden'>
        {data?.map((item, index) => (
          <SwiperSlide
            className='cursor-pointer  '
            key={index}>
            <div className='flex justify-center'>
              <Image
                src={item['src']}
                alt='NextUI hero Image'
                width={2000}
                height={1000}
                className='w-auto h-auto object-cover '
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
