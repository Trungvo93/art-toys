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
    <div className='mt-4 '>
      <div>
        <h1 className=''>Hàng mới về</h1>
      </div>
      <div className='grid grid-cols-4 gap-4'>
        {reverseData?.map((item, index) => (
          <div key={item.id}>
            <Image
              src={item.preview_url[0]}
              alt={item.title}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
