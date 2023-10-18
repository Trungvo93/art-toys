'use client';

import { Button, Image } from '@nextui-org/react';
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
export default function NewArrivalPage(props: { data: Product[] | null }) {
  const { data } = props;
  const reverseData = data?.reverse().slice(0, 8);
  return (
    <div className='mt-16 sm:mx-40'>
      <div className='mb-8'>
        <h1 className='text-center text-2xl'>Hàng mới về</h1>
      </div>
      <div className='grid md:grid-cols-4 grid-cols-2 gap-y-12 gap-x-12'>
        {reverseData?.map((item, index) => (
          <div
            key={index}
            className='grid gap-y-4 border hover:cursor-pointer'>
            <div className=' relative group  '>
              <Image
                src={item.preview_url[1]}
                alt={item.title}
                radius='none'
                removeWrapper
                className=' h-full object-cover   '
              />
              <Image
                src={item.preview_url[0]}
                alt={item.title}
                radius='none'
                removeWrapper
                className=' h-full object-cover absolute top-0 left-0 opacity-100 group-hover:opacity-0  '
              />
            </div>
            <div className='grid gap-2 px-4 pb-4'>
              <p className='font-semibold'>{item.brand}</p>
              <p className='line-clamp-1 hover:text-default-red'>
                {item.title}
              </p>
              <p className='text-default-red font-semibold'>
                {item.price
                  .toString()
                  .replace(/[^-\d.]/g, '')
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                <span className='text-xs '>đ</span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
