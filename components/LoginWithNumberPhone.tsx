'use client';
import { Button, Input } from '@nextui-org/react';
import Link from 'next/link';
import { useMemo, useState } from 'react';
export default function LoginWithNumberPhonePage() {
  const [value, setValue] = useState<string>('');
  const validateNumberPhone = (value: string) => value.match(/^\d{10}$/);
  const isInvalid = useMemo(() => {
    if (value === '') return false;
    return validateNumberPhone(value) ? false : true;
  }, [value]);
  const handleSubmit = () => {
    if (isInvalid == false && value !== ' ') {
      console.log('Submit');
    }
  };
  return (
    <div className=' flex flex-col gap-4 '>
      <Input
        classNames={{
          base: 'max-w-full sm:min-w-[500px] min-w-[250px] h-10',
          mainWrapper: 'h-full',
          input: 'text-small',
          inputWrapper:
            'h-full font-normal text-default-500 bg-default-400/20 dark:bg-default-500/20',
        }}
        placeholder='Nhập số điện thoại'
        size='sm'
        startContent={<i className='bi bi-phone text-xl'></i>}
        type='string'
        isInvalid={isInvalid}
        color={isInvalid ? 'danger' : 'default'}
        errorMessage={isInvalid && 'Số điện thoại không đúng'}
        onValueChange={setValue}
      />
      <Button
        endContent={<i className='bi bi-envelope'></i>}
        color='danger'
        onClick={handleSubmit}>
        Lấy mã OTP
      </Button>
    </div>
  );
}
