'use client';
import { Navigation, Thumbs, FreeMode } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

import Image from 'next/image';
import { useState } from 'react';
import { Button, Input } from '@nextui-org/react';
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
  description: string[];
  preview_url: string[];
  detail: string[];
  skus: SKUS[];
};

type PREADDITEM = {
  typeSku: string;
  count: number;
};
export default function ProductItemPage(props: { data: Product | null }) {
  const { data } = props;
  const productItem = data;
  const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);
  const [preAddItem, setPreAddItem] = useState<PREADDITEM>({
    typeSku: 'signle',
    count: 1,
  });

  const handleChangeTypeSku = (type: string) => {
    setPreAddItem({ ...preAddItem, typeSku: type });
  };
  const handleIncreaseCount = (count: number) => {
    setPreAddItem({ ...preAddItem, count: ++count });
  };
  const handleDecreaseCount = (count: number) => {
    if (preAddItem.count >= 2) {
      setPreAddItem({ ...preAddItem, count: --count });
    }
  };

  console.log(productItem);
  return (
    <div className='mt-8 xl:mx-64 lg:mx-52  sm:mx-8 mx-4'>
      <div className='grid md:grid-cols-2 grid-cols-1 gap-16  '>
        {/* Preview Image */}
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

        <div className='flex flex-col gap-8'>
          <p className='font-bold text-3xl'>{productItem?.title}</p>
          <p className='text-default-red font-semibold'>
            {preAddItem.typeSku === 'signle'
              ? productItem?.skus[0]['price']
                  .toString()
                  .replace(/[^-\d.]/g, '')
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
              : productItem?.skus[1]['price']
                  .toString()
                  .replace(/[^-\d.]/g, '')
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            <span className='text-xs '>{productItem && 'đ'}</span>
          </p>

          {/* Type Box */}
          <div className='flex gap-4'>
            <Button
              radius='none'
              color='danger'
              variant={preAddItem.typeSku === 'signle' ? 'solid' : 'ghost'}
              onClick={() => {
                handleChangeTypeSku('signle');
              }}>
              Hộp đơn
            </Button>
            {productItem?.skus[1] && (
              <Button
                radius='none'
                color='danger'
                variant={preAddItem.typeSku === 'set' ? 'solid' : 'ghost'}
                onClick={() => {
                  handleChangeTypeSku('set');
                }}>
                Nguyên set
              </Button>
            )}
          </div>

          {/* Quantity */}
          <div className='grid gap-2'>
            <p className='font-bold'>SỐ LƯỢNG</p>
            <div className='flex gap-4 items-center'>
              <button
                className={` h-8 w-8 border ${
                  preAddItem.count === 1 && 'text-gray-300'
                }`}
                onClick={() => {
                  handleDecreaseCount(preAddItem.count);
                }}>
                -
              </button>
              <span>{preAddItem.count}</span>

              <button
                className=' h-8 w-8 border '
                onClick={() => {
                  handleIncreaseCount(preAddItem.count);
                }}>
                +
              </button>
            </div>
          </div>

          <Button
            color='danger'
            radius='none'>
            Thêm vào giỏ hàng
          </Button>
          <div className='grid gap-4'>
            <p className='font-bold'>MÔ TẢ</p>
            <div className='grid gap-4'>
              {productItem?.description.map((item, index) => (
                <p key={index}>{item}</p>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className='grid justify-center mt-24'>
        {productItem?.detail.map((item, index) => (
          <Image
            key={index}
            src={item}
            priority
            alt={productItem.title}
            width={2000}
            height={1000}
            className='w-auto h-auto object-cover '
          />
        ))}
      </div>
    </div>
  );
}
