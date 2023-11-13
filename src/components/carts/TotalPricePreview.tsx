'use client';
import { database } from '../../../firebase/firebaseConfig';
import { AppContext } from '@/context/contextConfig';
import { useState, useEffect, useContext } from 'react';
import { Button } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
export default function TotalPricePreviewPage() {
  const { state, dispatch } = useContext(AppContext);
  const router = useRouter();
  const [totalMoney, setTotalMoney] = useState<number>(0);
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
  const handleGotoDetailsCart = () => {
    router.push('/cart');
  };
  return (
    <div className={` grid gap-4`}>
      <div className='flex justify-between text-default-red gap-2 text-small font-bold'>
        <span>Thành tiền:</span>
        <span className={``}>
          {totalMoney
            .toString()
            .replace(/[^-\d.]/g, '')
            .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          đ
        </span>
      </div>
      <div className='grid grid-cols-2 gap-4 '>
        <Button
          variant='solid'
          color='danger'
          radius='none'
          onClick={() => {
            handleGotoDetailsCart();
          }}>
          Chi tiết giỏ hàng
        </Button>
        <Button
          variant='ghost'
          color='danger'
          radius='none'>
          Thanh toán
        </Button>
      </div>
    </div>
  );
}
