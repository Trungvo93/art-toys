'use client';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

import { Button, Image } from '@nextui-org/react';
import { useState, useEffect } from 'react';
type Banner = {
  id: string;
  src: string;
};
export default function BannerPage(props: { data: Banner[] | null }) {
  const { data } = props;
  return (
    <div className='p-4'>
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
