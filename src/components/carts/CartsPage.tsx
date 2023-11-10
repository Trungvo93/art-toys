'use client';
import { AppContext } from '@/context/contextConfig';
import { Cart, DetailCart, QuantityDetailCart } from '@/lib/DefiningTypes';
import Image from 'next/image';
import { useState, useEffect, useContext } from 'react';
import {
  ref,
  get,
  query,
  orderByChild,
  equalTo,
  limitToFirst,
  orderByValue,
  orderByKey,
  push,
  update,
  set,
} from 'firebase/database';
import { database } from '../../../firebase/firebaseConfig';
export default function CartsPage() {
  const { state, dispatch } = useContext(AppContext);
  const handleDecreaseQuantity = async (
    e: QuantityDetailCart,
    index: number
  ) => {
    const cartsRef = ref(database, 'carts');
    await get(
      query(cartsRef, orderByChild('userID'), equalTo(state.userProfile.uid))
    )
      .then((snapshot) => {
        // If user have carts already
        if (snapshot.exists()) {
          const dataCart = Object.values(snapshot.val())[0] as Cart;
          const keyCart = Object.keys(snapshot.val());

          const newCart: Cart = { ...dataCart };

          if (e.typeSku === 'signle') {
            newCart.carts[index].quantity[0].count = newCart.carts[index]
              .quantity[0].count--;
          } else {
            newCart.carts[index].quantity[1].count = newCart.carts[index]
              .quantity[1].count--;
          }
          console.log('newCart: ', newCart);

          // Put item to list carts of user
          update(ref(database, `/carts/${keyCart}`), newCart);

          //Update item to Badge Carts
          let countItemCart = 0;
          newCart?.carts.map((item: any) => {
            if (item.quantity[0].count > 0) {
              countItemCart++;
            }
            if (item.quantity[1].count > 0) {
              countItemCart++;
            }
          });
          dispatch({
            type: 'CARTS_UPDATE_SUCCESS',
            payload: newCart,
          });
          dispatch({
            type: 'BADGE_UPDATE_SUCCESS',
            payload: { counts: countItemCart },
          });
        } else {
          console.log('Not item available');
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };
  return (
    <div className='grid gap-4 mt-2'>
      {state.carts?.carts.map((item, index) => {
        return item.quantity.map((e) => {
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
                        handleDecreaseQuantity(e, index);
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
