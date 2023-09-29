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
} from '@nextui-org/react';
import { useState, useEffect, useContext } from 'react';
import Link from 'next/link';
import LoginWithNumberPhonePage from './user/LoginWithNumberPhone';
import LoginWithEmailPage from './user/LoginWithEmail';
import { auth } from '../../firebase/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import ButtonProfilePage from './user/ButtonProfile';
import { AppContext } from '@/context/contextConfig';
export default function TopHeadPage() {
  const { state, dispatch } = useContext(AppContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  useEffect(() => {
    onAuthStateChanged(auth, (account) => {
      if (account) {
        dispatch({ type: 'LOGIN_SUCCESS', payload: account });
      } else {
      }
    });
  }, []);
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
            href={'#'}
            className=''>
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
        {state.userProfile !== undefined ? (
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
                    Khách hàng mới?
                    <Link
                      href={'/register'}
                      className='text-red-600'
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
          showArrow={true}>
          <PopoverTrigger>
            <Tooltip
              showArrow
              placement='bottom'
              content='Giỏ hàng'
              color='danger'>
              <Button
                color='default'
                variant='light'
                isIconOnly>
                <Badge
                  content='5'
                  color='danger'
                  shape='circle'
                  size='sm'>
                  <i className='bi bi-bag-plus text-xl'></i>
                </Badge>
              </Button>
            </Tooltip>
          </PopoverTrigger>
          <PopoverContent>
            <div className='px-1 py-2 '>
              <div className='text-small font-bold'>Popover Content</div>
              <div className='text-tiny'>This is the popover content</div>
            </div>
          </PopoverContent>
        </Popover>
      </NavbarContent>
    </Navbar>
  );
}