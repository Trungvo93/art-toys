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

  useEffect(() => {
    setIgnoreFistCheck(true);
  }, []);
  //Validate OldPassword
  useMemo(() => {
    if (oldPassword.length > 0 || ignoreFistCheck == false) {
      setIsInvalidOldPassword(false);
    } else {
      setIsInvalidOldPassword(true);
    }
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
    if (oldPassword.length <= 0) {
      setIsInvalidOldPassword(true);
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
        reauthenticateWithCredential(auth.currentUser, credential)
          .then(() => {
            if (auth.currentUser) {
              updatePassword(auth.currentUser, password)
                .then(() => {
                  console.log('change password success');
                })
                .catch((err) => {
                  console.log('Error updating password: ', err);
                });
            }
          })
          .catch((error) => {
            console.log('Error re-authenticate: ', error);
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
        }}>
        <ModalContent>
          {(onClose) => (
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
                  errorMessage={
                    isInvalidOldPassword && 'Mật khẩu không được để trống'
                  }
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
              </ModalBody>
              <ModalFooter>
                <Button
                  color='danger'
                  variant='light'
                  onPress={onClose}>
                  Quay lại
                </Button>
                <Button
                  type='submit'
                  color='danger'
                  onClick={(e) => {
                    handleSubmit(e);
                  }}>
                  Thay đổi
                </Button>
              </ModalFooter>
            </form>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
