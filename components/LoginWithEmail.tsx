'use client';
import { Button, Input } from '@nextui-org/react';
import { useMemo, useState, useEffect } from 'react';
import { auth } from '../firebase/firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
export default function LoginWithEmailPage() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isInvalidEmail, setIsInvalidEmail] = useState(false);
  const [isInvalidPassword, setIsInvalidPassword] = useState<boolean>(false);
  const [ignoreFistCheck, setIgnoreFistCheck] = useState(false);

  const toggleVisibility = () => setShowPassword(!showPassword);
  useEffect(() => {
    setIgnoreFistCheck(true);
  }, []);
  //Validate Email
  const validateEmail = (value: string) =>
    value.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g);
  useMemo(() => {
    if (ignoreFistCheck == false) {
      setIsInvalidEmail(false);
    } else {
      const result = validateEmail(email) ? false : true;
      setIsInvalidEmail(result);
    }
  }, [email]);

  //Validate Password
  useMemo(() => {
    if (password.length > 0 || ignoreFistCheck == false) {
      setIsInvalidPassword(false);
    } else {
      setIsInvalidPassword(true);
    }
  }, [password]);
  const handleSubmit = () => {
    if (email.length <= 0) {
      setIsInvalidEmail(true);
    }
    if (password.length <= 0) {
      setIsInvalidPassword(true);
    }
    if (
      isInvalidEmail == false &&
      email.length > 0 &&
      isInvalidPassword == false &&
      password.length > 0
    ) {
      console.log('Email: ', email);
      console.log('Password: ', password);
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          console.log(user);
        })
        .catch((error) => {
          console.log('loggin error: ', error);
        });
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
        isInvalid={isInvalidEmail}
        color={isInvalidEmail ? 'danger' : 'default'}
        errorMessage={isInvalidEmail && 'Email không đúng định dạng'}
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
        isInvalid={isInvalidPassword}
        errorMessage={isInvalidPassword && 'Mật khẩu không được để trống'}
        color={isInvalidPassword ? 'danger' : 'default'}
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
