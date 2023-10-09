'use client';
import { auth } from '../../../firebase/firebaseConfig';
import { updateProfile } from 'firebase/auth';
import { useEffect, useState, useContext } from 'react';
import {
  Button,
  Spinner,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from '@nextui-org/react';
import { AppContext } from '@/context/contextConfig';
import { useRouter } from 'next/navigation';
import EditProfilePage from './EditProfile';
import ChangePasswordPage from './ChangePassword';
import ChangeAvatarPage from './ChangeAvatar';
export default function UserProfilePage() {
  const { state, dispatch } = useContext(AppContext);
  const [firstLoad, setFirstLoad] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const router = useRouter();
  useEffect(() => {
    setTimeout(() => {
      setFirstLoad(true);
    }, 2000);
  }, []);
  useEffect(() => {
    if (state.userProfile === undefined) {
      setIsEdit(false);
    }
  }, [state.userProfile]);

  const handleGotoHomePage = () => {
    router.push('/');
  };
  const handleEdit = () => {
    setIsEdit(!isEdit);
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
            </div>
          </div>
        )}
      </div>
    );
  }
}
