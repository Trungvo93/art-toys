'use client';
import React, { useState, useEffect, useContext, useMemo } from 'react';
import { AppContext } from '../../context/contextConfig';
import { auth } from '../../../firebase/firebaseConfig';
import {
  Button,
  Spinner,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Input,
} from '@nextui-org/react';
import {
  reauthenticateWithCredential,
  EmailAuthProvider,
  updatePassword,
} from 'firebase/auth';

export default function ChangePasswordPage() {
  const { state, dispatch } = useContext(AppContext);
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [isLoading, setIsLoading] = useState(false);
  const [ignoreFistCheck, setIgnoreFistCheck] = useState(false);

  const [oldPassword, setOldPassword] = useState('');
  const [password, setPassword] = useState<string>('');
  const [rePassword, setRePassword] = useState<string>('');

  const [showOldPassword, setShowOldPassword] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showRePassword, setShowRePassword] = useState<boolean>(false);

  const toggleVisibilityOldPassword = () =>
    setShowOldPassword(!showOldPassword);
  const toggleVisibilityPassword = () => setShowPassword(!showPassword);
  const toggleVisibilityRePassword = () => setShowRePassword(!showRePassword);

  const [isInvalidOldPassword, setIsInvalidOldPassword] = useState(false);
  const [isInvalidPassword, setIsInvalidPassword] = useState(false);
  const [isInvalidRePassword, setIsInvalidRePassword] = useState(false);

  const [errorOldPassword, setErrorOldPassword] = useState('');
  const [showError, setShowError] = useState('');
  useEffect(() => {
    setIgnoreFistCheck(true);
  }, []);
  //Validate OldPassword
  useMemo(() => {
    if (oldPassword.length > 0 || ignoreFistCheck == false) {
      setIsInvalidOldPassword(false);
      setErrorOldPassword('');
    } else {
      setIsInvalidOldPassword(true);
      setErrorOldPassword('Mật khẩu không được để trống');
    }
    setShowError('');
  }, [oldPassword]);

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
    setShowError('');
  }, [password]);

  //Validate Re-password
  useMemo(() => {
    if (rePassword === password) {
      setIsInvalidRePassword(false);
    } else {
      setIsInvalidRePassword(true);
    }
    setShowError('');
  }, [rePassword]);

  const handleClodeModal = () => {
    setOldPassword('');
    setPassword('');
    setRePassword('');
    onClose();
  };

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (oldPassword.length <= 0) {
      setIsInvalidOldPassword(true);
      setErrorOldPassword('Mật khẩu không được để trống');
    }
    if (password.length <= 0) {
      setIsInvalidPassword(true);
    }
    if (rePassword !== password) {
      setIsInvalidRePassword(true);
    }
    if (
      isInvalidOldPassword === false &&
      isInvalidPassword === false &&
      password.length > 0 &&
      rePassword === password
    ) {
      const credential = EmailAuthProvider.credential(
        state.userProfile.email,
        oldPassword
      );
      if (auth.currentUser) {
        setIsLoading(true);
        reauthenticateWithCredential(auth.currentUser, credential)
          .then(() => {
            if (auth.currentUser) {
              updatePassword(auth.currentUser, password)
                .then(() => {
                  console.log('change password success');
                  setIsLoading(false);
                  setOldPassword('');
                  setPassword('');
                  setRePassword('');
                  onClose();
                })
                .catch((err) => {
                  setIsLoading(false);
                  console.log('Error updating password: ', err);
                });
            }
          })
          .catch((error) => {
            console.log('Error re-authenticate: ', error.code);
            setIsLoading(false);
            if (error.code === 'auth/invalid-login-credentials') {
              setIsInvalidOldPassword(true);
              setErrorOldPassword('Mật khẩu cũ không chính xác');
            }
            if (error.code === 'auth/too-many-requests') {
              setIsInvalidOldPassword(true);
              setShowError('Thao tác quá nhiều lần, hãy thử lại sau 5 phút');
            }
          });
      }
    }
  };
  return (
    <div>
      <Button
        color='secondary'
        variant='ghost'
        onClick={() => {
          onOpen();
        }}
        className='w-full sm:w-auto'>
        Thay đổi mật khẩu
      </Button>
      <Modal
        isOpen={isOpen}
        onOpenChange={() => {
          onOpenChange();
        }}
        onClose={() => {
          handleClodeModal();
        }}>
        <ModalContent>
          {
            <form>
              <ModalHeader className='flex flex-col gap-1'>
                Thay đổi mật khẩu
              </ModalHeader>
              <ModalBody>
                <Input
                  className='w-full'
                  label='Mật khẩu cũ'
                  endContent={
                    <button
                      className='focus:outline-none'
                      type='button'
                      onClick={toggleVisibilityOldPassword}>
                      {showOldPassword ? (
                        <i className='bi bi-eye-slash text-xl'></i>
                      ) : (
                        <i className='bi bi-eye text-xl'></i>
                      )}
                    </button>
                  }
                  type={showOldPassword ? 'text' : 'password'}
                  value={oldPassword}
                  onValueChange={setOldPassword}
                  isInvalid={isInvalidOldPassword}
                  errorMessage={isInvalidOldPassword && errorOldPassword}
                  color={isInvalidOldPassword ? 'danger' : 'default'}
                />
                <Input
                  className='w-full'
                  label='Mật khẩu mới'
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
                  label='Nhập lại mật khẩu mới'
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
                {showError.length > 0 && (
                  <span className='text-default-red text-xs'>{showError}</span>
                )}
              </ModalBody>
              <ModalFooter>
                <Button
                  color='danger'
                  variant='light'
                  onPress={() => {
                    handleClodeModal();
                  }}>
                  Quay lại
                </Button>
                <Button
                  isLoading={isLoading}
                  type='submit'
                  color='danger'
                  onClick={(e) => {
                    handleSubmit(e);
                  }}>
                  Thay đổi
                </Button>
              </ModalFooter>
            </form>
          }
        </ModalContent>
      </Modal>
    </div>
  );
}
