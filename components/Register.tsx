'use client';
import { Button, Input } from '@nextui-org/react';
import { useMemo, useState, useEffect } from 'react';
import { auth } from '../firebase/firebaseConfig';
export default function RegisterPage() {
  const [fullName, setFullName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const toggleVisibilityPassword = () => setShowPassword(!showPassword);

  const [ignoreFistCheck, setIgnoreFistCheck] = useState(false);
  const [isInvalidFullName, setIsInvalidFullName] = useState(false);
  const [isInvalidEmail, setIsInvalidEmail] = useState(false);
  const [isInvalidPassword, setIsInvalidPassword] = useState(false);
  useEffect(() => {
    setIgnoreFistCheck(true);
  }, []);

  //Validate Fullname
  useMemo(() => {
    if (fullName.length > 0 || ignoreFistCheck == false) {
      setIsInvalidFullName(false);
    } else {
      setIsInvalidFullName(true);
    }
  }, [fullName]);

  //validate Email
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
    if (fullName.length <= 0) {
      setIsInvalidFullName(true);
    }
    if (email.length <= 0) {
      setIsInvalidEmail(true);
    }
    if (password.length <= 0) {
      setIsInvalidPassword(true);
    }
    if (
      isInvalidFullName == false &&
      isInvalidEmail == false &&
      isInvalidPassword == false &&
      fullName.length > 0 &&
      email.length > 0 &&
      password.length > 0
    ) {
      console.log('Full name: ', fullName);
      console.log('Email: ', email);
      console.log('Password: ', password);
    }
  };
  return (
    <div className='flex flex-col gap-4 justify-center items-center mt-12 sm:w-[500px] w-[250px] m-auto'>
      <h1 className=' text-xl text-default-red'>Đăng ký tài khoản</h1>
      <p className='text-sm'>Hãy điền đầy đủ thông tin dưới đây:</p>
      <Input
        value={fullName}
        onValueChange={setFullName}
        isInvalid={isInvalidFullName}
        errorMessage={isInvalidFullName && 'Họ và tên không được để trống'}
        color={isInvalidFullName ? 'danger' : 'default'}
        label='Họ và tên'
        type='text'
        className='w-full'
      />
      <Input
        value={email}
        onValueChange={setEmail}
        isInvalid={isInvalidEmail}
        errorMessage={isInvalidEmail && 'Email không đúng định dạng'}
        color={isInvalidEmail ? 'danger' : 'default'}
        label='Email'
        type='email'
        className='w-full'
      />

      <Input
        className='w-full'
        label='Mật khẩu'
        size='sm'
        endContent={
          <button
            className='focus:outline-none'
            type='button'
            onClick={toggleVisibilityPassword}>
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
        className='w-full '
        color='danger'
        onClick={() => {
          handleSubmit();
        }}>
        Đăng ký
      </Button>
    </div>
  );
}
