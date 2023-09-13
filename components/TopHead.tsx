import Image from 'next/image';

export default function TopHeadPage() {
  return (
    <div className='fixed w-full bg-white py-4 border-b-2 border-slate-400'>
      <Image
        src={'/assets/header/logo.png'}
        alt='Logo'
        priority
        width={70}
        height={70}
        className='w-auto h-auto object-cover'
      />
    </div>
  );
}
