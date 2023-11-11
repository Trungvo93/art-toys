'use client';
import { auth } from '../../../firebase/firebaseConfig';
import { useEffect, useState, useContext } from 'react';
import { Button, Spinner } from '@nextui-org/react';
import { signOut } from 'firebase/auth';

import { AppContext } from '@/context/contextConfig';
import { useRouter } from 'next/navigation';
import EditProfilePage from './EditProfile';
import ChangePasswordPage from './ChangePassword';
import ChangeAvatarPage from './ChangeAvatar';
export default function UserProfilePage() {
  const { state, dispatch } = useContext(AppContext);
  const [isEdit, setIsEdit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (state.userProfile === undefined) {
      setIsEdit(false);
    }
  }, [state.userProfile]);

  const handleGotoHomePage = () => {
    router.push('/');
  };
  const handleGotoLoginPage = () => {
    router.push('/login');
  };
  const handleGotoRegister = () => {
    router.push('/register');
  };
  const handleEdit = () => {
    setIsEdit(!isEdit);
  };
  const handleSignOut = () => {
    setIsLoading(true);
    signOut(auth)
      .then(() => {
        dispatch({ type: 'LOGOUT_SUCCESS', payload: {} });
      })
      .catch((error) => {
        setIsLoading(false);
        console.log('Error sign out: ', error);
      });
  };
  if (!state.userProfile) {
    if (state.userProfile === undefined) {
      return (
        <div className='sm:w-[500px] mx-auto mt-6 w-full flex flex-col justify-center items-center gap-4 p-4'>
          <p className='text-xl text-center'>Bạn chưa đăng nhập tài khoản</p>
          <Button
            className='sm:w-auto w-full'
            color='danger'
            variant='solid'
            onClick={() => {
              handleGotoLoginPage();
            }}>
            Đăng nhập tài khoản
          </Button>
          <Button
            className='sm:w-auto w-full'
            color='danger'
            variant='solid'
            onClick={() => {
              handleGotoRegister();
            }}>
            Đăng ký tài khoản mới
          </Button>
          <Button
            className='sm:w-auto w-full'
            color='secondary'
            variant='ghost'
            onClick={() => {
              handleGotoHomePage();
            }}>
            Quay lại trang chủ
          </Button>
        </div>
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
  } else {
    return (
      <div className='px-4'>
        {isEdit ? (
          <EditProfilePage toggleFunction={handleEdit} />
        ) : (
          <div className='flex flex-col gap-4  mt-12 sm:w-[600px] w-full m-auto '>
            <h1 className='text-xl text-default-red text-center'>
              Thông tin tài khoản
            </h1>
            <ChangeAvatarPage />
            <div className=''>ID: {state.userProfile?.uid}</div>
            <div className=''>
              Tên hiển thị: {state.userProfile?.displayName}
            </div>
            <div className=''>Email: {state.userProfile?.email}</div>

            <div className='flex flex-col sm:flex-row gap-4'>
              <Button
                color='danger'
                onClick={() => {
                  handleEdit();
                }}
                className='w-full sm:w-auto'>
                Sửa thông tin
              </Button>
              <ChangePasswordPage />
              <Button
                isLoading={isLoading}
                color='danger'
                variant='ghost'
                onClick={() => {
                  handleSignOut();
                }}>
                Đăng xuất
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  }
}
