'use client';
import { Button, Input, Spinner } from '@nextui-org/react';
import { useMemo, useState, useEffect, useContext } from 'react';
import { auth } from '../../../firebase/firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { AppContext } from '@/context/contextConfig';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const { state, dispatch } = useContext(AppContext);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isInvalidEmail, setIsInvalidEmail] = useState(false);
  const [isInvalidPassword, setIsInvalidPassword] = useState<boolean>(false);
  const [ignoreFistCheck, setIgnoreFistCheck] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [errorCode, setErrorCode] = useState<string>('');

  const [firstLoad, setFirstLoad] = useState(false);
  const router = useRouter();
  useEffect(() => {
    if (state.userProfile) {
      router.push('/');
    }
    setFirstLoad(true);
  }, [state.userProfile]);

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
    setErrorCode('');
  }, [email]);

  //Validate Password
  useMemo(() => {
    if (password.length > 0 || ignoreFistCheck == false) {
      setIsInvalidPassword(false);
    } else {
      setIsInvalidPassword(true);
    }
    setErrorCode('');
  }, [password]);

  //Submit
  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
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
      setIsLoading(true);
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          dispatch({ type: 'LOGIN_SUCCESS', payload: user });
        })
        .catch((error) => {
          console.log('login error: ', error.code);
          setIsLoading(false);
          if (error.code === 'auth/invalid-login-credentials') {
            setErrorCode('Tài khoản hoặc mật khẩu không chính xác!');
          }
        });
    }
  };

  if (state.userProfile === undefined) {
    return (
      <form>
        <div className='flex flex-col gap-4  mt-12 sm:w-[500px] w-full m-auto '>
          <h1 className='text-xl text-default-red text-center'>
            Đăng nhập tài khoản
          </h1>
          <div className=' flex flex-col gap-4  '>
            <Input
              classNames={{
                base: 'max-w-full sm:min-w-[500px] min-w-[250px] h-10 text-base focus:text-base',
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
              inputMode='email'
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
            {errorCode.length > 0 ? (
              <span className='text-default-red text-xs'>{errorCode}</span>
            ) : (
              ''
            )}
            <Button
              type='submit'
              isLoading={isLoading}
              id='sign-in-button'
              color='danger'
              onClick={handleSubmit}>
              Đăng nhập
            </Button>
          </div>
        </div>
      </form>
    );
  } else {
    return (
      <div className='sm:w-[500px] mx-auto mt-6 w-full flex flex-col justify-center items-center gap-4'>
        <Spinner
          size='lg'
          color='danger'
        />
      </div>
    );
  }
}
