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
  remove,
} from 'firebase/database';
import { database } from '../../../firebase/firebaseConfig';
import Link from 'next/link';
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
            newCart.carts[index].quantity[0].count =
              newCart.carts[index].quantity[0].count >= 1
                ? newCart.carts[index].quantity[0].count - 1
                : 0;
          } else {
            newCart.carts[index].quantity[1].count =
              newCart.carts[index].quantity[1].count >= 1
                ? newCart.carts[index].quantity[1].count - 1
                : 0;
          }
          newCart.carts.map((item, index) => {
            if (item.quantity[0].count === 0 && item.quantity[1].count === 0) {
              newCart.carts.splice(index, 1);
            }
          });
          console.log('newCartBadge: ', newCart);
          if (newCart.carts.length > 0) {
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
            remove(ref(database, `/carts/${keyCart}`));
            dispatch({
              type: 'CARTS_REMOVE_SUCCESS',
              payload: {},
            });
            dispatch({
              type: 'BADGE_UPDATE_SUCCESS',
              payload: { counts: 0 },
            });
          }
        } else {
          console.log('Not item available');
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleIncreaseQuantity = async (
    e: QuantityDetailCart,
    index: number
  ) => {
    const cartsRef = ref(database, 'carts');
    //  Get new data
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
            newCart.carts[index].quantity[0].count =
              newCart.carts[index].quantity[0].count + 1;
          } else {
            newCart.carts[index].quantity[1].count =
              newCart.carts[index].quantity[1].count + 1;
          }

          console.log('newCartBadge: ', newCart);

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
    <div className='grid gap-4 my-2 pe-4 max-h-[250px]   overscroll-contain overflow-y-scroll '>
      {state.carts?.carts.map((item, index) => {
        return item.quantity.map((e, index2) => {
          return (
            <div
              key={index2}
              className={`flex gap-4 ${e.count <= 0 ? 'hidden' : 'block'} `}>
              <Image
                src={item.thumbnail}
                alt={item.title}
                width={1000}
                height={1000}
                className='aspect-square w-24 '
              />
              <div className='grid gap-2 w-full'>
                <Link
                  href={`/products/${item.productID}`}
                  target='_blank'>
                  {item.title}
                </Link>
                <p className='text-default-red'>
                  {e.typeSku === 'signle' ? 'Hộp' : 'Set'}
                </p>
                {/* <div className='flex gap-4 items-center'>
                  <button
                    className={` h-8 w-8 border `}
                    onClick={() => {
                      handleDecreaseQuantity(e, index);
                    }}>
                    -
                  </button>
                  <span>{e.count}</span>
                  <button
                    className=' h-8 w-8 border '
                    onClick={() => {
                      handleIncreaseQuantity(e, index);
                    }}>
                    +
                  </button>
                </div> */}
                <div className='flex justify-between items-center'>
                  <div className='flex gap-4 items-center'>
                    <button
                      className={` h-8 w-8 border `}
                      onClick={() => {
                        handleDecreaseQuantity(e, index);
                      }}>
                      -
                    </button>
                    <span>{e.count}</span>
                    <button
                      className=' h-8 w-8 border '
                      onClick={() => {
                        handleIncreaseQuantity(e, index);
                      }}>
                      +
                    </button>
                  </div>
                  <div>
                    <span className='text-sm'>
                      {(e.count * e.price)
                        .toString()
                        .replace(/[^-\d.]/g, '')
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      đ
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        });
      })}
    </div>
  );
}
