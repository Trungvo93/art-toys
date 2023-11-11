'use client';
import React, { useState, useContext, useMemo } from 'react';
import { AppContext } from '@/context/contextConfig';
import {
  Button,
  Input,
  useDisclosure,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from '@nextui-org/react';
import { auth } from '../../../firebase/firebaseConfig';
import { updateProfile, verifyBeforeUpdateEmail } from 'firebase/auth';
import { useRouter } from 'next/navigation';
interface Props {
  toggleFunction: () => void;
}
export default function EditProfilePage({ toggleFunction }: Props) {
  const { state, dispatch } = useContext(AppContext);
  const [fullName, setFullName] = useState<string>(
    state.userProfile.displayName
  );
  const [email, setEmail] = useState<string>(state.userProfile.email);

  const [isInvalidFullName, setIsInvalidFullName] = useState(false);
  const [isInvalidEmail, setIsInvalidEmail] = useState(false);
  const [errorMessageEmail, setErrorMessageEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [switchText, setSwitchText] = useState(false);
  const router = useRouter();
  //Validate Fullname
  useMemo(() => {
    if (fullName.length > 0) {
      setIsInvalidFullName(false);
    } else {
      setIsInvalidFullName(true);
    }
  }, [fullName]);

  //validate Email
  const validateEmail = (value: string) =>
    value.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g);
  useMemo(() => {
    const result = validateEmail(email) ? false : true;
    setIsInvalidEmail(result);
    setErrorMessageEmail('Email không đúng định dạng');
  }, [email]);

  const handleSubmit = () => {
    setIsLoading(true);
    if (auth.currentUser) {
      if (auth.currentUser.email !== email) {
        setSwitchText(true);
        verifyBeforeUpdateEmail(auth.currentUser, email)
          .then(() => {
            setIsLoading(false);
          })
          .catch((err) => {
            console.log('Error verify update mail: ', err.message);
          });
      }
      if (auth.currentUser.displayName !== fullName) {
        updateProfile(auth.currentUser, { displayName: fullName })
          .then(() => {
            if (auth.currentUser !== null) {
              dispatch({
                type: 'USER_UPDATE_SUCCESS',
                payload: auth.currentUser,
              });
            }
            setIsLoading(false);
            if (auth.currentUser?.email === email) {
              onClose();
              toggleFunction();
            }
          })
          .catch((error) => {
            console.log('Error updating displayName: ', error);
          });
      }
    }
  };
  const backHomePage = () => {
    onClose();
    setSwitchText(false);
    dispatch({ type: 'LOGOUT_SUCCESS', payload: {} });
    router.push('/');
  };
  return (
    <form>
      <div className='flex flex-col gap-4  mt-12 sm:w-[600px] w-full m-auto '>
        <h1 className='text-xl text-default-red text-center'>
          Thông tin tài khoản
        </h1>
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
          errorMessage={isInvalidEmail && errorMessageEmail}
          color={isInvalidEmail ? 'danger' : 'default'}
          label='Email'
          type='email'
          inputMode='email'
          className='w-full'
        />
        <Button
          type='submit'
          color='danger'
          className=''
          onClick={(e: React.SyntheticEvent) => {
            e.preventDefault();
            onOpen();
          }}>
          Lưu thông tin
        </Button>
        <Button
          onClick={() => {
            toggleFunction();
          }}>
          Hủy bỏ
        </Button>

        <Modal
          hideCloseButton
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          isDismissable={!switchText}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className='flex flex-col gap-1'>
                  {switchText
                    ? 'Bạn đã cập nhật email thành công!'
                    : 'Xác nhận lưu thông tin!'}
                </ModalHeader>
                <ModalBody>
                  {switchText
                    ? 'Xác nhận email mới và đăng nhập lại!'
                    : 'Bạn có chắc chắn lưu?'}
                </ModalBody>
                {switchText ? (
                  <ModalFooter>
                    <Button
                      color='danger'
                      fullWidth
                      onClick={() => {
                        backHomePage();
                      }}>
                      Quay lại trang chủ
                    </Button>
                  </ModalFooter>
                ) : (
                  <ModalFooter>
                    <Button
                      color='danger'
                      variant='light'
                      onPress={onClose}>
                      Không
                    </Button>
                    <Button
                      isLoading={isLoading}
                      color='danger'
                      onPress={() => {
                        handleSubmit();
                      }}>
                      Có
                    </Button>
                  </ModalFooter>
                )}
              </>
            )}
          </ModalContent>
        </Modal>
      </div>
    </form>
  );
}
