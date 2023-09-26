'use client';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  Button,
  Avatar,
  Divider,
} from '@nextui-org/react';
import Link from 'next/link';
import { auth } from '../../../firebase/firebaseConfig';
import { signOut } from 'firebase/auth';
import { useState, useContext } from 'react';
import { AppContext } from '@/context/contextConfig';

export default function ButtonProfilePage() {
  const { state, dispatch } = useContext(AppContext);
  const [isLoading, setIsLoading] = useState(false);
  const handleSignOut = () => {
    setIsLoading(true);
    signOut(auth)
      .then(() => {
        dispatch({ type: 'LOGOUT_SUCCESS', payload: {} });
      })
      .catch((error) => {
        setIsLoading(false);
        console.log('Error sign out: ', error);
      });
  };
  return (
    <div>
      <Popover
        placement='bottom'
        showArrow>
        <PopoverTrigger>
          <Button
            isIconOnly
            variant='light'
            aria-label='User Profile'>
            <Avatar
              isBordered
              color={
                state.userProfile?.photoURL !== null ? 'primary' : 'default'
              }
              className='transition-transform w-6 h-6 '
              src=''
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <div className='px-1 py-2  flex flex-col gap-4 '>
            <div className='text-center flex flex-col gap-2 '>
              <span>THÔNG TIN TÀI KHOẢN</span>
              <Divider />
            </div>
            <p>{state.userProfile?.displayName}</p>
            <Link
              href='/account'
              className='hover:text-default-red hover:underline underline-offset-4'>
              Quản lý tài khoản
            </Link>
            <Divider />
            <Button
              isLoading={isLoading}
              color='danger'
              variant='ghost'
              onClick={() => {
                handleSignOut();
              }}>
              Đăng xuất
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
