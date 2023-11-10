'use client';
import { AppContext } from '@/context/contextConfig';
import { DetailCart } from '@/lib/DefiningTypes';
import Image from 'next/image';
import { useState, useEffect, useContext } from 'react';

export default function CartsPage() {
  const { state, dispatch } = useContext(AppContext);
  const handleDecreaseQuantity = (item: DetailCart) => {
    console.log(item);
  };
  return (
    <div className='grid gap-4 mt-2'>
      {state.carts?.carts.map((item) => {
        return item.quantity.map((e, index) => {
          if (e.count > 0)
            return (
              <div
                key={index}
                className='flex gap-4'>
                <Image
                  src={item.thumbnail}
                  alt={item.title}
                  width={1000}
                  height={1000}
                  className='aspect-square w-24 '
                />
                <div className='grid gap-2'>
                  <p>{item.title}</p>
                  <p className='text-default-red'>
                    {e.typeSku === 'signle' ? 'Hộp' : 'Set'}
                  </p>
                  <div className='flex gap-4 items-center'>
                    <button
                      className={` h-8 w-8 border `}
                      onClick={() => {
                        handleDecreaseQuantity(item);
                      }}>
                      -
                    </button>
                    <span>{e.count}</span>
                    <button className=' h-8 w-8 border '>+</button>
                  </div>
                </div>
              </div>
            );
        });
      })}
    </div>
  );
}
