'use client';
import { auth } from '../../firebase/firebaseConfig';
import { updateProfile, onAuthStateChanged } from 'firebase/auth';
import { useEffect, useState, useContext } from 'react';
import { Button, Spinner } from '@nextui-org/react';
import { AppContext } from '@/context/contextConfig';
import { useRouter } from 'next/navigation';
export default function UserProfilePage() {
  const { state, dispatch } = useContext(AppContext);
  const [firstLoad, setFirstLoad] = useState(false);
  const router = useRouter();
  useEffect(() => {
    setTimeout(() => {
      setFirstLoad(true);
    }, 2000);
  }, []);
  const handleUpdateProfile = () => {
    const profile = auth.currentUser;

    if (profile != null) {
      updateProfile(profile, { displayName: 'Thành Trung 126' })
        .then(() => {
          dispatch({ type: 'USER_UPDATE_SUCCESS', payload: profile });
        })
        .catch((error) => {
          console.log('Error updating: ', error);
        });
    }
  };
  const handleGotoHomePage = () => {
    router.push('/');
  };
  if (state.userProfile === undefined) {
    if (firstLoad === true) {
      return (
        <div className='sm:w-[500px] mx-auto mt-6 w-full flex flex-col justify-center items-center gap-4'>
          <p className='text-xl text-center'>Bạn chưa đăng nhập tài khoản</p>
          <Button
            color='danger'
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
        <div className='flex flex-col gap-4  mt-12 sm:w-[600px] w-full m-auto '>
          <h1 className='text-xl text-default-red text-center'>
            Thông tin tài khoản
          </h1>
          <div className=''>ID: {state.userProfile?.uid}</div>
          <div className=''>Tên hiển thị: {state.userProfile?.displayName}</div>
          <div className=''>Email: {state.userProfile?.email}</div>
          <div className=''>
            Số điện thoại: {state.userProfile?.phoneNumber}
          </div>
          <div>
            <Button
              color='danger'
              onClick={() => {
                handleUpdateProfile();
              }}>
              Sửa thông tin
            </Button>
          </div>
        </div>
      </div>
    );
  }
}
