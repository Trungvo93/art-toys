'use client';
import { Button, Input } from '@nextui-org/react';
import { useMemo, useState, useEffect } from 'react';
import { auth } from '../firebase/firebaseConfig';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from 'firebase/auth';
export default function RegisterPage() {
  const [fullName, setFullName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [rePassword, setRePassword] = useState<string>('');

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showRePassword, setShowRePassword] = useState<boolean>(false);

  const toggleVisibilityPassword = () => setShowPassword(!showPassword);
  const toggleVisibilityRePassword = () => setShowRePassword(!showRePassword);

  const [ignoreFistCheck, setIgnoreFistCheck] = useState(false);
  const [isInvalidFullName, setIsInvalidFullName] = useState(false);
  const [isInvalidEmail, setIsInvalidEmail] = useState(false);
  const [isInvalidPassword, setIsInvalidPassword] = useState(false);
  const [isInvalidRePassword, setIsInvalidRePassword] = useState(false);

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
    if (rePassword === password) {
      setIsInvalidRePassword(false);
    } else {
      setIsInvalidRePassword(true);
    }
  }, [password]);

  //Validate Re-password
  useMemo(() => {
    if (rePassword === password) {
      setIsInvalidRePassword(false);
    } else {
      setIsInvalidRePassword(true);
    }
  }, [rePassword]);
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
    if (rePassword !== password) {
      setIsInvalidRePassword(true);
    }
    if (
      isInvalidFullName == false &&
      isInvalidEmail == false &&
      isInvalidPassword == false &&
      fullName.length > 0 &&
      email.length > 0 &&
      password.length > 0 &&
      rePassword === password
    ) {
      console.log('Full name: ', fullName);
      console.log('Email: ', email);
      console.log('Password: ', password);
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          console.log(user);
        })
        .catch((error) => {
          console.log('Error creating user: ', error);
        });
    }
  };
  const handleCheckLogin = () => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log('user already logged: ', user.email);
      } else {
        console.log('user not logged');
      }
    });
  };
  const handleSignOut = () => {
    signOut(auth);
    handleCheckLogin();
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

      <Input
        className='w-full'
        label='Nhập lại mật khẩu'
        endContent={
          <button
            className='focus:outline-none'
            type='button'
            onClick={toggleVisibilityRePassword}>
            {showRePassword ? (
              <i className='bi bi-eye-slash text-xl'></i>
            ) : (
              <i className='bi bi-eye text-xl'></i>
            )}
          </button>
        }
        type={showRePassword ? 'text' : 'password'}
        value={rePassword}
        onValueChange={setRePassword}
        isInvalid={isInvalidRePassword}
        errorMessage={
          isInvalidRePassword && 'Mật khẩu nhập lại không trùng khớp'
        }
        color={isInvalidRePassword ? 'danger' : 'default'}
      />
      <Button
        className='w-full '
        color='danger'
        onClick={() => {
          handleSubmit();
        }}>
        Đăng ký
      </Button>
      <Button
        className='w-full '
        color='danger'
        onClick={() => {
          handleCheckLogin();
        }}>
        Kiểm tra login
      </Button>

      <Button
        className='w-full '
        color='danger'
        onClick={() => {
          handleSignOut();
        }}>
        Logout
      </Button>
    </div>
  );
}
