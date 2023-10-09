'use client';
import { Button, Input, Spinner } from '@nextui-org/react';
import React, { useMemo, useState, useEffect, useContext } from 'react';
import { auth } from '../../../firebase/firebaseConfig';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { AppContext } from '@/context/contextConfig';
import { redirect } from 'next/navigation';
export default function RegisterPage() {
  const { state, dispatch } = useContext(AppContext);
  const [firstLoad, setFirstLoad] = useState(false);

  const [fullName, setFullName] = useState<string>('');
  // const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [rePassword, setRePassword] = useState<string>('');

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showRePassword, setShowRePassword] = useState<boolean>(false);

  const toggleVisibilityPassword = () => setShowPassword(!showPassword);
  const toggleVisibilityRePassword = () => setShowRePassword(!showRePassword);

  const [ignoreFistCheck, setIgnoreFistCheck] = useState(false);
  const [isInvalidFullName, setIsInvalidFullName] = useState(false);
  // const [isInvalidPhoneNumber, setIsInvalidPhoneNumber] = useState(false);
  const [isInvalidEmail, setIsInvalidEmail] = useState(false);
  const [isInvalidPassword, setIsInvalidPassword] = useState(false);
  const [isInvalidRePassword, setIsInvalidRePassword] = useState(false);
  const [errorMessageEmail, setErrorMessageEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIgnoreFistCheck(true);
    setTimeout(() => {
      setFirstLoad(true);
    }, 2000);
  }, []);

  //Validate Fullname
  useMemo(() => {
    if (fullName.length > 0 || ignoreFistCheck == false) {
      setIsInvalidFullName(false);
    } else {
      setIsInvalidFullName(true);
    }
  }, [fullName]);

  //Validate Number Phone
  // const validatePhone = (value: string) =>
  //   value.match(/(84|0[3|5|7|8|9])+([0-9]{8})\b/g);
  // useMemo(() => {
  //   if (ignoreFistCheck == false) {
  //     setIsInvalidPhoneNumber(false);
  //   } else {
  //     const result = validatePhone(phoneNumber) ? false : true;
  //     setIsInvalidPhoneNumber(result);
  //   }
  // }, [phoneNumber]);

  //validate Email
  const validateEmail = (value: string) =>
    value.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g);
  useMemo(() => {
    if (ignoreFistCheck == false) {
      setIsInvalidEmail(false);
    } else {
      const result = validateEmail(email) ? false : true;
      setIsInvalidEmail(result);
      setErrorMessageEmail('Email không đúng định dạng');
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
  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
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
      // isInvalidPhoneNumber == false &&
      isInvalidEmail == false &&
      isInvalidPassword == false &&
      fullName.length > 0 &&
      // phoneNumber.length > 0 &&
      email.length > 0 &&
      password.length > 0 &&
      rePassword === password
    ) {
      setIsLoading(true);
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          updateProfile(user, { displayName: fullName })
            .then(() => {
              // Profile updated!
              dispatch({ type: 'USER_UPDATE_SUCCESS', payload: user });
            })
            .catch((error) => {
              console.log('Error add Full Name: ', error);
              setIsLoading(false);

              // An error occurred
              // ...
            });
        })
        .catch((error) => {
          console.log('Error creating user: ', error.code);
          if (error.code === 'auth/email-already-in-use') {
            setIsInvalidEmail(true);
            setErrorMessageEmail('Email đã tồn tại');
          }
          setIsLoading(false);
        });
    }
  };

  if (!state.userProfile) {
    if (state.userProfile === null) {
      return (
        <div className='sm:w-[500px] mx-auto mt-6 w-full flex flex-col justify-center items-center gap-4'>
          <Spinner
            size='lg'
            color='danger'
          />
        </div>
      );
    } else {
      return (
        <form>
          <div className='px-4 pb-8'>
            <div className='flex flex-col gap-4 justify-center items-center mt-12 sm:w-[600px] w-full m-auto '>
              <h1 className=' text-xl text-default-red'>Đăng ký tài khoản</h1>
              <p className='text-sm'>Hãy điền đầy đủ thông tin dưới đây:</p>
              <Input
                value={fullName}
                onValueChange={setFullName}
                isInvalid={isInvalidFullName}
                errorMessage={
                  isInvalidFullName && 'Họ và tên không được để trống'
                }
                color={isInvalidFullName ? 'danger' : 'default'}
                label='Họ và tên'
                type='text'
                className='w-full'
              />
              {/* <Input
              value={phoneNumber}
              onValueChange={setPhoneNumber}
              isInvalid={isInvalidPhoneNumber}
              errorMessage={
                isInvalidPhoneNumber && 'Số điện thoại không đúng định dạng'
              }
              color={isInvalidPhoneNumber ? 'danger' : 'default'}
              label='Số điện thoại'
              type='text'
              className='w-full'
            /> */}
              <Input
                value={email}
                onValueChange={setEmail}
                isInvalid={isInvalidEmail}
                errorMessage={isInvalidEmail && errorMessageEmail}
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
                errorMessage={
                  isInvalidPassword && 'Mật khẩu không được để trống'
                }
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
                isLoading={isLoading}
                type='submit'
                className='w-full '
                color='danger'
                onClick={(e) => {
                  handleSubmit(e);
                }}>
                Đăng ký
              </Button>
            </div>
          </div>
        </form>
      );
    }
  } else {
    redirect('/');
  }
}
