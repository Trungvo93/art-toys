'use client';
import { AppContext } from '@/context/contextConfig';
import { useState, useEffect, useContext } from 'react';
import { database } from '../../../firebase/firebaseConfig';
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
import { Cart, DetailCart, QuantityDetailCart } from '@/lib/DefiningTypes';
import Image from 'next/image';
import Link from 'next/link';
import { Button, Divider } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import { async } from '@firebase/util';
export default function CartDetailsPage() {
  const { state, dispatch } = useContext(AppContext);
  const [totalMoney, setTotalMoney] = useState<number>(0);
  const router = useRouter();
  useEffect(() => {
    let tempMoney = 0;
    if (state.carts?.carts) {
      state.carts?.carts.map((item) => {
        tempMoney =
          tempMoney +
          item.quantity[0].count * item.quantity[0].price +
          item.quantity[1].count * item.quantity[1].price;
      });
    }
    setTotalMoney(tempMoney);
  }, [state.carts]);
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
  const handleRemoveItem = async (e: QuantityDetailCart, index: number) => {
    const newCart: Cart = JSON.parse(JSON.stringify(state.carts));
    if (e.typeSku === 'signle') {
      newCart.carts[index].quantity[0].count = 0;
    } else {
      newCart.carts[index].quantity[1].count = 0;
    }
    newCart.carts.map((item, index) => {
      if (item.quantity[0].count === 0 && item.quantity[1].count === 0) {
        newCart.carts.splice(index, 1);
      }
    });
    // Update item to list carts of user
    update(ref(database, `/carts/${state.keyCart}`), newCart);
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
  };
  return (
    <div className='my-8 xl:mx-64 lg:mx-52  sm:mx-8 mx-4'>
      <h1 className='text-center font-bold text-3xl'>Giỏ hàng của bạn</h1>
      {state.carts ? (
        <div className='mt-8 flex md:flex-row flex-col gap-8  '>
          <div className='grid gap-8 md:basis-3/5'>
            {state.carts?.carts.map((item, index) => {
              return item.quantity.map((e, index2) => {
                return (
                  <div
                    key={index2}
                    className={`flex gap-4 ${
                      e.count <= 0 ? 'hidden' : 'block'
                    }`}>
                    <Image
                      src={item.thumbnail}
                      alt={item.title}
                      width={1000}
                      height={1000}
                      className='aspect-square w-24 '
                    />
                    <div className='grid gap-2 w-full'>
                      <div className='flex justify-between gap-2 items-center'>
                        <Link
                          href={`/products/${item.productID}`}
                          target='_blank'
                          className='text-sm'>
                          {item.title}
                        </Link>

                        <i
                          className='bi bi-x-lg cursor-pointer'
                          onClick={() => {
                            handleRemoveItem(e, index);
                          }}></i>
                      </div>

                      <p className='text-default-red'>
                        {e.typeSku === 'signle' ? 'Hộp' : 'Set'}
                      </p>
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
                        <div className='text-default-red text-sm'>
                          {(e.count * e.price)
                            .toString()
                            .replace(/[^-\d.]/g, '')
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                          đ
                        </div>
                      </div>
                    </div>
                  </div>
                );
              });
            })}
          </div>
          <div className='md:basis-2/5  bg-gray-100 p-4 h-full '>
            <div className='flex justify-between gap-4 items-center'>
              <span className='text-sm'>Tổng tiền</span>
              <span className='text-default-red font-semibold'>
                {totalMoney
                  .toString()
                  .replace(/[^-\d.]/g, '')
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                đ
              </span>
            </div>
            <Divider className='my-4' />
            <p className='text-sm'>
              Phí vận chuyển sẽ được tính ở trang thanh toán.
            </p>
            <p className='text-sm'>
              Bạn cũng có thể nhập mã giảm giá ở trang thanh toán.
            </p>
            <Button
              color='danger'
              className='my-4 w-full'
              radius='none'
              onClick={() => {
                router.push('/checkout');
              }}>
              Thanh toán
            </Button>
          </div>
        </div>
      ) : (
        <div>
          <p className='text-center text-gray-400 font-semibold my-8'>
            Chưa có sản phẩm nào trong giỏ hàng
          </p>
          <p
            onClick={() => {
              router.back();
            }}
            className='cursor-pointer text-blue-600 text-center'>
            Quay lại trang trước <i className='bi bi-arrow-return-left'></i>
          </p>
        </div>
      )}
    </div>
  );
}
