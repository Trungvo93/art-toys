'use client';

import { Spinner } from '@nextui-org/react';

export default function LoadingPage() {
  return (
    <div className='sm:w-[500px] mx-auto mt-6 w-full flex flex-col justify-center items-center gap-4 p-4'>
      <Spinner
        size='lg'
        color='danger'
      />
    </div>
  );
}
