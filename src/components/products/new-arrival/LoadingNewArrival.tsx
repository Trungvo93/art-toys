'use client';
import { Skeleton } from '@nextui-org/react';
export default function LoadingNewArrivalPage() {
  return (
    <div>
      <Skeleton className='rounded-lg'>
        <div
          className={`2xl:h-[450px] xl:h-[400px] lg:h[300px] md:h-[240px] sm:h-[190px] h-[150px] rounded-lg bg-default-300`}></div>
      </Skeleton>
    </div>
  );
}
