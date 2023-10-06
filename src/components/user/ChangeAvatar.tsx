'use client';
import { Avatar, Button } from '@nextui-org/react';
import { AppContext } from '@/context/contextConfig';
import {
  useState,
  useContext,
  SyntheticEvent,
  ChangeEvent,
  useEffect,
} from 'react';
import { storage, auth } from '../../../firebase/firebaseConfig';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { updateProfile } from 'firebase/auth';
import { v4 as uuidv4 } from 'uuid';
interface Avatar {
  name: string;
  previewBlob: string;
  fileAvatar: Blob;
}

export default function ChangeAvatarPage() {
  const { state, dispatch } = useContext(AppContext);
  const [avatar, setAvatar] = useState<Avatar | undefined>(undefined);

  useEffect(() => {
    return () => {
      avatar && URL.revokeObjectURL(avatar.previewBlob);
    };
  }, [avatar]);
  const handleChangeImage = (e: ChangeEvent<HTMLInputElement>) => {
    const file =
      e.target.files && e.target.files.length > 0 ? e.target.files[0] : null;

    if (file !== null) {
      setAvatar({
        name: file.name,
        previewBlob: URL.createObjectURL(file),
        fileAvatar: file,
      });
    }
  };
  const handleSubmit = () => {
    if (avatar) {
      const storageRef = ref(
        storage,
        'avatar/' + uuidv4() + '-' + avatar?.name
      );
      const uploadTask = uploadBytesResumable(storageRef, avatar?.fileAvatar);
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + progress + '% done');
          switch (snapshot.state) {
            case 'paused':
              console.log('Upload is paused');
              break;
            case 'running':
              console.log('Upload is running');
              break;
          }
        },
        (error) => {
          switch (error.code) {
            case 'storage/unauthorized':
              // User doesn't have permission to access the object
              console.log('Error unauthorized: ', error.code);
              break;
            case 'storage/canceled':
              // User canceled the upload
              console.log('Error canceled: ', error.code);

              break;

            // ...

            case 'storage/unknown':
              // Unknown error occurred, inspect error.serverResponse
              console.log('Error unknown: ', error.code);
              break;
          }
        },
        () => {
          // Upload completed successfully, now we can get the download URL
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.log('File available at', downloadURL);
            if (auth.currentUser !== null) {
              updateProfile(auth.currentUser, {
                photoURL: downloadURL,
              })
                .then(() => {
                  if (auth.currentUser) {
                    dispatch({
                      type: 'USER_UPDATE_SUCCESS',
                      payload: auth.currentUser,
                    });
                    setAvatar(undefined);
                  }
                })
                .catch((error) => {
                  console.log('Error upload Avatar to User: ', error);
                });
            }
          });
        }
      );
    }
  };
  const handleCancel = () => {
    (document.getElementById('uploadFile') as HTMLInputElement).value = '';
    setAvatar(undefined);
  };
  return (
    <div className='flex flex-col sm:flex-row gap-4 items-center'>
      <Avatar
        isBordered
        color={state.userProfile?.photoURL !== null ? 'primary' : 'default'}
        name={state.userProfile?.displayName.charAt(0).toUpperCase()}
        className='transition-transform  text-large '
        src={avatar ? avatar.previewBlob : state.userProfile?.photoURL}
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
        }}
        className='w-full sm:w-auto'>
        Đổi đại diện
      </Button>
      {avatar ? (
        <Button
          color='danger'
          onClick={() => {
            handleSubmit();
          }}
          className='w-full sm:w-auto'>
          Lưu
        </Button>
      ) : (
        ''
      )}

      {avatar ? (
        <Button
          color='secondary'
          variant='ghost'
          onClick={() => {
            handleCancel();
          }}
          className='w-full sm:w-auto'>
          Không lưu
        </Button>
      ) : (
        ''
      )}
    </div>
  );
}
