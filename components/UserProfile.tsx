'use client';
import { auth } from '../firebase/firebaseConfig';
import { updateProfile, onAuthStateChanged } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { Button } from '@nextui-org/react';
export default function UserProfilePage() {
  interface Profile {
    [key: string]: any;
  }
  const [user, setUser] = useState<Profile>();
  useEffect(() => {
    onAuthStateChanged(auth, (account) => {
      if (account) {
        setUser({ ...account });
        console.log(account);
      } else {
        console.log('user not logged');
      }
    });
  }, []);

  const handleUpdateProfile = () => {
    const profile = auth.currentUser;

    if (profile != null) {
      updateProfile(profile, { displayName: 'Thành Trung 123' })
        .then(() => {
          setUser({ ...profile });
        })
        .catch((error) => {
          console.log('Error updating: ', error);
        });
    }
  };
  return (
    <div className='px-4'>
      <div className='flex flex-col gap-4  mt-12 sm:w-[600px] w-full m-auto '>
        <h1 className='text-xl text-default-red text-center'>
          Thông tin tài khoản
        </h1>
        <div className=''>ID: {user?.uid}</div>
        <div className=''>Tên hiển thị: {user?.displayName}</div>
        <div className=''>Email: {user?.email}</div>
        <div className=''>Số điện thoại: {user?.phoneNumber}</div>
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
