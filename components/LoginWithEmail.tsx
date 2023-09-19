'use client';
import { Button, Input } from '@nextui-org/react';
import { useMemo, useState } from 'react';
import { auth } from '../firebase/firebaseConfig';
export default function LoginWithEmailPage() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const toggleVisibility = () => setShowPassword(!showPassword);

  const validateEmail = (value: string) =>
    value.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g);
  const isInvalid = useMemo(() => {
    if (email === '') return false;
    return validateEmail(email) ? false : true;
  }, [email]);
  const handleSubmit = () => {
    if (isInvalid == false && email !== '') {
      console.log('Email: ', email);
      console.log('Password: ', password);
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
        placeholder='Email'
        size='sm'
        startContent={<i className='bi bi-envelope-at text-xl'></i>}
        type='string'
        isInvalid={isInvalid}
        color={isInvalid ? 'danger' : 'default'}
        errorMessage={isInvalid && 'Email không đúng định dạng'}
        onValueChange={setEmail}
      />

      <Input
        classNames={{
          base: 'max-w-full sm:min-w-[500px] min-w-[250px] h-10',
          mainWrapper: 'h-full',
          input: 'text-small',
          inputWrapper:
            'h-full font-normal text-default-500 bg-default-400/20 dark:bg-default-500/20',
        }}
        placeholder='Mật khẩu'
        size='sm'
        startContent={
          <button
            className='focus:outline-none'
            type='button'
            onClick={toggleVisibility}>
            {showPassword ? (
              <i className='bi bi-eye-slash text-xl'></i>
            ) : (
              <i className='bi bi-eye text-xl'></i>
            )}
          </button>
        }
        type={showPassword ? 'text' : 'password'}
        value={password}
        onValueChange={setPassword}
      />
      <Button
        id='sign-in-button'
        color='danger'
        onClick={handleSubmit}>
        Đăng nhập
      </Button>
    </div>
  );
}
