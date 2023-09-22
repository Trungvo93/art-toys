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
import { auth } from '../firebase/firebaseConfig';
import { signOut } from 'firebase/auth';
import { useState } from 'react';
interface Profile {
  [key: string]: any;
}
export default function ButtonProfilePage(props: Profile) {
  const [user, setUser] = useState(props.userProfile);
  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        setUser(undefined);
        console.log('Sign out success');
      })
      .catch((error) => {
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
              color={user?.photoURL !== null ? 'primary' : 'default'}
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
            <p>{user?.displayName}</p>
            <Link
              href='/account'
              className='hover:text-default-red hover:underline underline-offset-4'>
              Quản lý tài khoản
            </Link>
            <Divider />
            <Button
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
