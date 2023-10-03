'use client';
import { Avatar, Button } from '@nextui-org/react';
import { AppContext } from '@/context/contextConfig';
import { useState, useContext, SyntheticEvent, ChangeEvent } from 'react';
export default function ChangeAvatarPage() {
  const { state, dispatch } = useContext(AppContext);
  const [previewAvatar, setPreviewAvatar] = useState('');
  const handleChangeImage = (e: ChangeEvent<HTMLInputElement>) => {
    // const target = e.target as HTMLInputElement;
    // const file: File = (target.files as FileList)[0];
    const file =
      e.target.files && e.target.files.length > 0 ? e.target.files[0] : null;

    if (file !== null) {
      setPreviewAvatar(URL.createObjectURL(file));
      URL.revokeObjectURL(URL.createObjectURL(file));
    }
  };
  const handleCancelUploadAvatar = () => {
    setPreviewAvatar('');
  };
  return (
    <div className='flex gap-4 items-center'>
      <Avatar
        isBordered
        color={state.userProfile?.photoURL !== null ? 'primary' : 'default'}
        name={state.userProfile?.displayName.charAt(0).toUpperCase()}
        className='transition-transform  text-large'
        src={
          previewAvatar.length > 0 ? previewAvatar : state.userProfile?.photoURL
        }
        size='lg'
      />
      <input
        type='file'
        accept='image/*'
        className='hidden'
        id='uploadFile'
        onChange={(e) => {
          handleChangeImage(e);
        }}
      />
      <Button
        onClick={() => {
          document.getElementById('uploadFile')?.click();
        }}>
        Tải hình lên
      </Button>
      <Button
        onClick={() => {
          handleCancelUploadAvatar();
          setPreviewAvatar('');
        }}>
        Không lưu
      </Button>
    </div>
  );
}
