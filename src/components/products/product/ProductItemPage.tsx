'use client';
import { Navigation, Thumbs, FreeMode } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

import Image from 'next/image';
import { useState, useContext } from 'react';
import { Button, Input } from '@nextui-org/react';
import { AppContext } from '@/context/contextConfig';
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
import { database } from '../../../../firebase/firebaseConfig';
import { Cart, PREADDITEM, Product } from '../../../lib/DefiningTypes';

export default function ProductItemPage(props: { data: Product | null }) {
  const { data } = props;
  const productItem = data;
  const { state, dispatch } = useContext(AppContext);

  //Slide thumbnails
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

  const handleAddToCart = async () => {
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
          const indexProductInListCarts = newCart.carts
            ? newCart.carts.findIndex(
                (item) => productItem?.id === item.productID
              )
            : -1;
          if (indexProductInListCarts < 0 && productItem) {
            newCart.carts.push({
              productID: productItem?.id,
              thumbnail: productItem.preview_url[0],
              title: productItem.title,
              quantity: [
                {
                  count: preAddItem.typeSku === 'signle' ? preAddItem.count : 0,
                  price: productItem.skus[0].price,
                  typeSku: 'signle',
                },
                {
                  count: preAddItem.typeSku === 'set' ? preAddItem.count : 0,
                  price: productItem.skus[1]
                    ? productItem.skus[1].price
                    : productItem.skus[0].price,
                  typeSku: 'set',
                },
              ],
            });
          } else {
            if (preAddItem.typeSku === 'signle') {
              newCart.carts[indexProductInListCarts].quantity[0].count =
                newCart.carts[indexProductInListCarts].quantity[0].count +
                preAddItem.count;
            } else {
              newCart.carts[indexProductInListCarts].quantity[1].count =
                newCart.carts[indexProductInListCarts].quantity[1].count +
                preAddItem.count;
            }
          }

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
          // User not have list carts
          set(push(ref(database, 'carts')), {
            userID: state.userProfile.uid,
            carts: [
              {
                productID: productItem?.id,
                title: productItem?.title,
                thumbnail: productItem?.preview_url[0],
                quantity: [
                  {
                    count:
                      preAddItem.typeSku === 'signle' ? preAddItem.count : 0,
                    price: productItem?.skus[0].price,
                    typeSku: 'signle',
                  },
                  {
                    count: preAddItem.typeSku === 'set' ? preAddItem.count : 0,
                    price: productItem?.skus[1].price,
                    typeSku: 'set',
                  },
                ],
              },
            ],
          });

          dispatch({
            type: 'CARTS_UPDATE_SUCCESS',
            payload: {
              userID: state.userProfile.uid,
              carts: [
                {
                  productID: productItem?.id,
                  title: productItem?.title,
                  thumbnail: productItem?.preview_url[0],
                  quantity: [
                    {
                      count:
                        preAddItem.typeSku === 'signle' ? preAddItem.count : 0,
                      price: productItem?.skus[0].price,
                      typeSku: 'signle',
                    },
                    {
                      count:
                        preAddItem.typeSku === 'set' ? preAddItem.count : 0,
                      price: productItem?.skus[1].price,
                      typeSku: 'set',
                    },
                  ],
                },
              ],
            },
          });
          dispatch({
            type: 'BADGE_UPDATE_SUCCESS',
            payload: { counts: 1 },
          });
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };
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
            {productItem && productItem?.skus[0].count > 0 && (
              <Button
                radius='none'
                color='danger'
                variant={preAddItem.typeSku === 'signle' ? 'solid' : 'ghost'}
                onClick={() => {
                  handleChangeTypeSku('signle');
                }}>
                Hộp đơn
              </Button>
            )}
            {productItem && productItem?.skus[1].count > 0 && (
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
            radius='none'
            onClick={() => {
              handleAddToCart();
            }}>
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
