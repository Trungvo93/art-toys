'use client';
import { Button, Input } from '@nextui-org/react';
import { useMemo, useState } from 'react';
import { auth } from '../firebase/firebaseConfig';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';

export default function LoginWithNumberPhonePage() {
  const [value, setValue] = useState<string>('');
  const validateNumberPhone = (value: string) =>
    value.match(/(84[3|5|7|8|9])+([0-9]{8})\b/g);
  const isInvalid = useMemo(() => {
    if (value === '') return false;
    return validateNumberPhone(value) ? false : true;
  }, [value]);
  const generateRecaptcha = () => {
    (window as any).recaptchaVerifier = new RecaptchaVerifier(
      auth,
      'sign-in-button',
      {
        size: 'invisible',
        callback: (response: any) => {
          // reCAPTCHA solved, allow signInWithPhoneNumber.
        },
      }
    );
  };
  const handleSubmit = async () => {
    if (isInvalid == false && value !== ' ') {
      console.log('Submit');
      await generateRecaptcha();
      const appVerifier = (window as any).recaptchaVerifier;
      signInWithPhoneNumber(auth, value, appVerifier)
        .then((confirmationResult) => {
          // SMS sent. Prompt user to type the code from the message, then sign the
          // user in with confirmationResult.confirm(code).
          (window as any).confirmationResult = confirmationResult;
          console.log(confirmationResult);
          // ...
        })
        .catch((error) => {
          // Error; SMS not sent
          // ...
        });
    }
  };
  const handleLogin = () => {
    const otp = 'uvresp';
    let confirmationResult = (window as any).confirmationResult;
    confirmationResult
      .confirm(otp)
      .then((result: any) => {
        // User signed in successfully.
        const user = result.user;
        // console.log('user: ', user);
        // ...
      })
      .catch((error: any) => {
        // User couldn't sign in (bad verification code?)
        // ...
      });
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
      <Button onClick={handleLogin}>Login test</Button>
      <Button
        id='sign-in-button'
        endContent={<i className='bi bi-envelope'></i>}
        color='danger'
        onClick={handleSubmit}>
        Lấy mã OTP
      </Button>
    </div>
  );
}
