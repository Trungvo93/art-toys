'use client';
import { Avatar, Button } from '@nextui-org/react';
import { AppContext } from '@/context/contextConfig';
import { useState, useContext } from 'react';
export default function ChangeAvatarPage() {
  const { state, dispatch } = useContext(AppContext);
  return (
    <div className='flex gap-4 items-center'>
      <Avatar
        isBordered
        color={state.userProfile?.photoURL !== null ? 'primary' : 'default'}
        name={state.userProfile?.displayName.charAt(0).toUpperCase()}
        className='transition-transform  text-large'
        src={state.userProfile?.photoURL}
        size='lg'
      />
      <input
        type='file'
        className='text-sm text-gray-500
      file:mr-4 file:py-2 file:px-4
      file:rounded-md file:border-0
      file:text-sm file:font-semibold
      file:bg-blue-500 file:text-white
      hover:file:bg-blue-600
    '
      />
    </div>
  );
}
