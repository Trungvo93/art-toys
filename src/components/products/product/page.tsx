'use client';
import { Navigation, Thumbs, FreeMode } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

import Image from 'next/image';
import { useState } from 'react';
import { title } from 'process';
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
export default function ProductItemPage(props: { data: Product | null }) {
  const { data } = props;
  const productItem = data;
  const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);
  console.log(data);
  return (
    <div className='mt-8 xl:mx-64 lg:mx-52  sm:mx-8 mx-4'>
      <div className='grid md:grid-cols-2 grid-cols-1 gap-16  '>
        <div>
          <Swiper
            modules={[FreeMode, Navigation, Thumbs]}
            spaceBetween={50}
            slidesPerView={1}
            loop={true}
            thumbs={{ swiper: thumbsSwiper }}
            className=' overflow-hidden'>
            {productItem?.preview_url.map((item, index) => (
              <SwiperSlide
                className='cursor-pointer  '
                key={index}>
                <div className='flex justify-center w-full'>
                  <Image
                    src={item}
                    alt={productItem.title}
                    width={2000}
                    height={1000}
                    className='w-auto h-auto object-cover '
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          <Swiper
            onSwiper={setThumbsSwiper}
            loop={true}
            spaceBetween={10}
            slidesPerView={productItem?.preview_url.length}
            freeMode={true}
            navigation
            watchSlidesProgress={true}
            modules={[FreeMode, Navigation, Thumbs]}
            className=' overflow-hidden'>
            {productItem?.preview_url.map((item, index) => (
              <SwiperSlide
                className='cursor-pointer  '
                key={index}>
                <div className='flex justify-center w-full'>
                  <Image
                    src={item}
                    alt={productItem.title}
                    width={2000}
                    height={1000}
                    className='w-auto h-auto object-cover '
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        <div>
          <p className='font-semibold text-xl'>{productItem?.title}</p>
          <p className='text-default-red'>
            {productItem?.price
              .toString()
              .replace(/[^-\d.]/g, '')
              .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            <span className='text-xs '>{productItem && 'đ'}</span>
          </p>
        </div>
      </div>
      <div></div>
    </div>
  );
}
