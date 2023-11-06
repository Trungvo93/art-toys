'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Product } from '../../../lib/DefiningTypes';

export default function NewArrivalPage(props: { data: Product[] | null }) {
  const { data } = props;
  const reverseData = data?.slice(-8, data.length).reverse();
  const router = useRouter();
  return (
    <div className='mt-16 xl:mx-40  sm:mx-8 mx-4'>
      <div className='mb-8'>
        <h1 className='text-center text-2xl'>Hàng mới về</h1>
      </div>
      <div className='grid md:grid-cols-4 grid-cols-2    gap-y-12 md:gap-x-12 gap-x-6'>
        {reverseData?.map((item, index) => (
          <div
            key={index}
            className='grid gap-y-4 border hover:cursor-pointer'
            onClick={() => {
              router.push(`/products/${item.id}`);
            }}>
            <div className=' relative group  '>
              <Image
                src={item.preview_url[1]}
                alt={item.title}
                width={1000}
                height={500}
                className='w-full h-auto object-cover   '
              />
              <Image
                src={item.preview_url[0]}
                alt={item.title}
                width={1000}
                height={500}
                className=' w-full h-auto object-cover absolute top-0 left-0 opacity-100 group-hover:opacity-0  '
              />
            </div>
            <div className='grid gap-2 px-4 pb-4'>
              <p className='font-semibold'>{item.brand}</p>
              <p className='line-clamp-1 hover:text-default-red'>
                {item.title}
              </p>
              <p className='text-default-red font-semibold'>
                {item.skus[0].price
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
