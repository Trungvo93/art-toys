'use client';
import Image from 'next/image';
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Button,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Tooltip,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Badge,
  Input,
  Accordion,
  AccordionItem,
  Divider,
} from '@nextui-org/react';
import { useState, useEffect, useContext, useRef } from 'react';
import Link from 'next/link';
import LoginWithEmailPage from './user/LoginWithEmail';
import { auth, database } from '../../firebase/firebaseConfig';
import {
  ref,
  get,
  query,
  orderByChild,
  equalTo,
  limitToFirst,
  orderByValue,
  orderByKey,
} from 'firebase/database';
import { onAuthStateChanged } from 'firebase/auth';
import ButtonProfilePage from './user/ButtonProfile';
import { AppContext } from '@/context/contextConfig';
import CartsPage from './carts/CartsPage';
import { isArray } from '@nextui-org/shared-utils';
import { Cart } from '../lib/DefiningTypes';
import TotalPricePreviewPage from './carts/TotalPricePreview';
import { useRouter } from 'next/navigation';

export default function TopHeadPage() {
  const { state, dispatch } = useContext(AppContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isOpenPopover, setIsOpenPopover] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  useEffect(() => {
    onAuthStateChanged(auth, (account) => {
      // If user is logged in
      if (account) {
        dispatch({ type: 'LOGIN_SUCCESS', payload: account });

        // Get data carts
        const cartsRef = ref(database, 'carts');
        const cartsQuery = query(
          cartsRef,
          orderByChild('userID'),
          equalTo(account?.uid)
        );

        get(cartsQuery)
          .then((snapshot) => {
            let result: Cart | null = null;

            //Convert data to Object data
            if (snapshot.exists()) {
              const dataCart = Object.values(snapshot.val())[0] as Cart;
              const keyCart = Object.keys(snapshot.val());

              // Dispatch carts of user to Context store
              dispatch({
                type: 'CARTS_UPDATE_SUCCESS',
                payload: dataCart,
              });
              dispatch({
                type: 'KEYCART_UPDATE_SUCCESS',
                payload: keyCart,
              });

              // Calculate the number of products in the shopping cart
              let countItemCart = 0;
              dataCart?.carts &&
                dataCart?.carts.map((item: any) => {
                  if (item.quantity[0].count > 0) {
                    countItemCart++;
                  }
                  if (item.quantity[1].count > 0) {
                    countItemCart++;
                  }
                });
              dispatch({
                type: 'BADGE_UPDATE_SUCCESS',
                payload: { counts: countItemCart },
              });
            } else {
              console.log('No data available');
              dispatch({ type: 'CARTS_REMOVE_SUCCESS', payload: {} });
              dispatch({
                type: 'BADGE_UPDATE_SUCCESS',
                payload: { counts: 0 },
              });
            }
          })
          .catch((error) => {
            console.error(error);
          });
      } else {
        // If user is not logged in
        dispatch({ type: 'LOGOUT_SUCCESS', payload: {} });
        dispatch({ type: 'CARTS_REMOVE_SUCCESS', payload: {} });
        dispatch({
          type: 'BADGE_UPDATE_SUCCESS',
          payload: { counts: 0 },
        });
      }
    });
  }, []);
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
    <Navbar
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
      className='bg-white '
      maxWidth='full'
      isBordered={true}>
      {/* Show menu */}
      <NavbarContent
        justify='start'
        className='gap-0'>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          className=''
        />
        <NavbarItem
          className='hover:cursor-pointer '
          onClick={() => {
            setIsMenuOpen(!isMenuOpen);
          }}>
          <span className='hidden sm:block ps-4'>Menu</span>
        </NavbarItem>
      </NavbarContent>
      <NavbarMenu className=' bg-white '>
        <NavbarMenuItem className='hover:text-default-red hover:bg-stone-100 rounded p-4'>
          <Link
            href={'#'}
            className='block '>
            Best seller
          </Link>
        </NavbarMenuItem>
        <NavbarMenuItem className='hover:text-default-red hover:bg-stone-100 rounded p-4'>
          <Link
            href={'#'}
            className='block '>
            All products
          </Link>
        </NavbarMenuItem>
        <NavbarMenuItem className=' hover:bg-stone-100 rounded px-4'>
          <Accordion>
            <AccordionItem
              key='1'
              aria-label='Blind box'
              title={<p className='hover:text-default-red'>Blind box</p>}
              className={`-mx-2  `}>
              <div className='bg-yellow-200'>
                <p>Pop mart</p>
                <p>Heyone</p>
                <p>Other art toys</p>
              </div>
            </AccordionItem>
          </Accordion>
        </NavbarMenuItem>
        <NavbarMenuItem className=' hover:bg-stone-100 rounded px-4'>
          <Accordion>
            <AccordionItem
              key='2'
              aria-label='Figuring'
              title={<p className='hover:text-default-red '>Figuring</p>}
              className={`-mx-2  `}>
              <p>Bandai</p>
              <p>Gundam</p>
            </AccordionItem>
          </Accordion>
        </NavbarMenuItem>
        <NavbarMenuItem className='hover:text-default-red hover:bg-stone-100 rounded p-4'>
          <Link
            href='/about'
            className='block'
            onClick={() => {
              setIsMenuOpen(false);
            }}>
            About
          </Link>
        </NavbarMenuItem>
        <NavbarMenuItem className='hover:text-default-red hover:bg-stone-100 rounded p-4 block sm:hidden '>
          <Link
            href={'/account'}
            className=''
            onClick={() => {
              setIsMenuOpen(false);
            }}>
            Tài khoản
          </Link>
        </NavbarMenuItem>
        <NavbarMenuItem className='hover:text-default-red hover:bg-stone-100 rounded p-4'>
          <Link
            href='#'
            className='block'>
            Socials
          </Link>
        </NavbarMenuItem>
        <NavbarMenuItem className='px-4 flex gap-4'>
          <i className='bi bi-facebook text-xl'></i>
          <i className='bi bi-instagram text-xl'></i>
        </NavbarMenuItem>
      </NavbarMenu>

      {/* Logo */}
      <NavbarContent justify='center'>
        <Tooltip
          showArrow
          placement='bottom'
          content='Trang chủ'
          color='danger'>
          <Link
            href='/'
            onClick={() => {
              setIsMenuOpen(false);
            }}>
            <Image
              src={'/assets/header/logo2.png'}
              alt='Logo'
              priority
              width={200}
              height={0}
              className='sm:w-48 w-40 h-auto object-cover'
            />
          </Link>
        </Tooltip>
      </NavbarContent>

      {/* RightSide */}
      <NavbarContent
        className='flex sm:gap-4 gap-1'
        justify='end'>
        {/* Search */}
        <Popover
          placement='bottom'
          showArrow={true}>
          <PopoverTrigger>
            <Button
              color='default'
              variant='light'
              isIconOnly>
              <i className='bi bi-search text-xl'></i>
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <div className='px-1 py-2 '>
              <Input
                classNames={{
                  base: 'max-w-full sm:w-[500px] w-[250px] h-10',
                  mainWrapper: 'h-full',
                  input: 'text-small',
                  inputWrapper:
                    'h-full font-normal text-default-500 bg-default-400/20 dark:bg-default-500/20',
                }}
                placeholder='Tìm kiếm tên sản phẩm...'
                size='sm'
                startContent={<i className='bi bi-search text-xl'></i>}
                type='search'
              />
            </div>
          </PopoverContent>
        </Popover>

        {/* User */}
        {state.userProfile ? (
          <ButtonProfilePage />
        ) : (
          <Popover
            isOpen={isLoginOpen}
            onOpenChange={setIsLoginOpen}
            placement='bottom'
            showArrow={true}>
            <PopoverTrigger>
              <Button
                className='sm:block hidden'
                color='default'
                variant='light'
                isIconOnly>
                <i className='bi bi-person text-2xl'></i>
              </Button>
            </PopoverTrigger>

            <PopoverContent>
              <div className='px-1 py-2  flex flex-col gap-4 '>
                <p className='text-center text-xl font-medium py-4'>
                  ĐĂNG NHẬP TÀI KHOẢN
                </p>
                <LoginWithEmailPage />
                <div>
                  <p className='text-center'>
                    <span> Khách hàng mới?</span>
                    <Link
                      href={'/register'}
                      className='text-red-600 ms-2'
                      onClick={() => {
                        setIsLoginOpen(false);
                      }}>
                      Tạo tài khoản
                    </Link>
                  </p>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        )}

        {/* Cart */}
        <Popover
          placement='bottom'
          showArrow={true}
          isOpen={isOpenPopover}
          onOpenChange={(open) => {
            setIsOpenPopover(open);
          }}
          shouldBlockScroll={true}>
          <PopoverTrigger>
            <Button
              color='default'
              variant='light'
              isIconOnly>
              <Badge
                content={state.badgeCart.counts}
                color='danger'
                shape='circle'
                size='sm'>
                <i className='bi bi-bag-plus text-xl'></i>
              </Badge>
            </Button>
          </PopoverTrigger>
          <PopoverContent className=''>
            <div className='px-1 py-2 '>
              <div className='text-small font-bold'>
                {state.userProfile
                  ? 'Giỏ hàng của bạn'
                  : 'Đăng nhập để xem giỏ hàng'}
              </div>
              {state.carts?.carts && (
                <div>
                  <Divider className='my-4' />
                  <CartsPage />
                  <Divider className='my-4' />
                  {/* <TotalPricePreviewPage /> */}
                  {/* Show Total Money and Action */}
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
                          setIsMenuOpen(false);
                        }}>
                        Chi tiết giỏ hàng
                      </Button>
                      <Button
                        variant='ghost'
                        color='danger'
                        radius='none'
                        onClick={() => {
                          router.push('/checkout');
                        }}>
                        Thanh toán
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </PopoverContent>
        </Popover>
      </NavbarContent>
    </Navbar>
  );
}
