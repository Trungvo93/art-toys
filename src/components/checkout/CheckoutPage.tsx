'use client';
import { AppContext } from '@/context/contextConfig';
import { useContext, useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Input, Accordion, AccordionItem } from '@nextui-org/react';
import Image from 'next/image';
import ProvincesVietNamPage from '@/lib/ProvincesVietNam';
import { Province } from '@/lib/DefiningTypes';
export default function CheckoutPage() {
  const router = useRouter();
  const { state, dispatch } = useContext(AppContext);
  const [ignoreFistCheck, setIgnoreFistCheck] = useState(false);
  const [firstLoad, setFirstLoad] = useState(false);
  const [fullName, setFullName] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [address, setAddress] = useState<Province>({
    city: '',
    districts: '',
    wards: '',
    street: '',
  });
  const [email, setEmail] = useState<string>('');
  const [isInvalidFullName, setIsInvalidFullName] = useState(false);
  const [isInvalidPhoneNumber, setIsInvalidPhoneNumber] = useState(false);
  const [isInvalidEmail, setIsInvalidEmail] = useState(false);
  const [errorMessageEmail, setErrorMessageEmail] = useState('');

  useEffect(() => {
    setIgnoreFistCheck(true);
    setTimeout(() => {
      setFirstLoad(true);
    }, 2000);
  }, []);
  useEffect(() => {
    setFullName(state.userProfile ? state.userProfile.displayName : '');
    setEmail(state.userProfile ? state.userProfile.email : '');
  }, [state.userProfile]);
  //Validate Fullname
  useMemo(() => {
    if (fullName.length > 0 || ignoreFistCheck == false) {
      setIsInvalidFullName(false);
    } else {
      setIsInvalidFullName(true);
    }
  }, [fullName]);
  //Validate Number Phone
  const validatePhone = (value: string) =>
    value.match(/(84|0[3|5|7|8|9])+([0-9]{8})\b/g);
  useMemo(() => {
    if (ignoreFistCheck == false) {
      setIsInvalidPhoneNumber(false);
    } else {
      const result = validatePhone(phoneNumber) ? false : true;
      setIsInvalidPhoneNumber(result);
    }
  }, [phoneNumber]);
  //validate Email
  const validateEmail = (value: string) =>
    value.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g);
  useMemo(() => {
    if (ignoreFistCheck == false) {
      setIsInvalidEmail(false);
    } else {
      const result = validateEmail(email) ? false : true;
      setIsInvalidEmail(result);
      setErrorMessageEmail('Email không đúng định dạng');
    }
  }, [email]);

  const addressCallback = (childData: Province) => {
    setAddress(JSON.parse(JSON.stringify(childData)));
  };
  return (
    <div className='my-8 xl:mx-64 lg:mx-52  sm:mx-8 mx-4'>
      <h1 className='text-center font-bold text-3xl mb-8'>
        Thông tin giao hàng
      </h1>
      {state.carts ? (
        <div className='grid md:grid-cols-2 grid-cols-1 gap-4'>
          {/* Left Side */}
          <div>
            <form className='grid gap-4'>
              <Input
                value={fullName}
                onValueChange={setFullName}
                isInvalid={isInvalidFullName}
                errorMessage={
                  isInvalidFullName && 'Họ và tên không được để trống'
                }
                radius='none'
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
                radius='none'
                inputMode='email'
                className='w-full'
              />
              <Input
                value={phoneNumber}
                onValueChange={setPhoneNumber}
                isInvalid={isInvalidPhoneNumber}
                errorMessage={
                  isInvalidPhoneNumber && 'Số điện thoại không đúng định dạng'
                }
                color={isInvalidPhoneNumber ? 'danger' : 'default'}
                label='Số điện thoại'
                type='text'
                radius='none'
                className='w-full'
              />
              <div className='w-full'>
                <ProvincesVietNamPage
                  addressCallback={addressCallback}
                  addressData={address}
                />
              </div>

              <p>
                Địa chỉ cụ thể: {address.city}, {address.districts},{' '}
                {address.wards}, {address.street}
              </p>
            </form>
          </div>

          {/* Right Side */}
          <div className='order-first md:order-last '>
            <div className='md:hidden block'>
              <Accordion>
                <AccordionItem
                  key='1'
                  aria-label='Hiển thị thông tin sản phẩm'
                  startContent={
                    <i className='bi bi-bag-heart text-cyan-600  font-semibold'></i>
                  }
                  title={
                    <span className='text-cyan-600  font-semibold '>
                      Hiển thị thông tin sản phẩm
                    </span>
                  }
                  className=''>
                  <div className='grid gap-4'>
                    {state.carts?.carts.map((item, index) => {
                      return item.quantity.map((e, index2) => {
                        return (
                          <div
                            key={index2}
                            className={`flex gap-4 items-center  ${
                              e.count <= 0 ? 'hidden' : 'block'
                            }`}>
                            <Image
                              src={item.thumbnail}
                              alt={item.title}
                              width={1000}
                              height={1000}
                              className='aspect-square w-16 '
                            />
                            <div className='grid gap-2 w-full'>
                              <p className='text-sm'>{item.title} </p>

                              <p className='text-default-red text-sm'>
                                {e.typeSku === 'signle' ? 'Hộp' : 'Set'} x{' '}
                                {e.count}
                              </p>
                            </div>
                            <div>
                              <p className='text-sm'>
                                {(e.count * e.price)
                                  .toString()
                                  .replace(/[^-\d.]/g, '')
                                  .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                đ
                              </p>
                            </div>
                          </div>
                        );
                      });
                    })}
                  </div>
                </AccordionItem>
              </Accordion>
            </div>
            <div className=' gap-4 md:px-4  md:border-l-2 md:grid hidden'>
              {state.carts?.carts.map((item, index) => {
                return item.quantity.map((e, index2) => {
                  return (
                    <div
                      key={index2}
                      className={`flex gap-4 items-center  ${
                        e.count <= 0 ? 'hidden' : 'block'
                      }`}>
                      <Image
                        src={item.thumbnail}
                        alt={item.title}
                        width={1000}
                        height={1000}
                        className='aspect-square w-16 '
                      />
                      <div className='grid gap-2 w-full'>
                        <p className='text-sm'>{item.title} </p>

                        <p className='text-default-red text-sm'>
                          {e.typeSku === 'signle' ? 'Hộp' : 'Set'} x {e.count}
                        </p>
                      </div>
                      <div>
                        <p className='text-sm'>
                          {(e.count * e.price)
                            .toString()
                            .replace(/[^-\d.]/g, '')
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                          đ
                        </p>
                      </div>
                    </div>
                  );
                });
              })}
            </div>
          </div>
        </div>
      ) : (
        <div>
          <p className='text-center text-gray-400 font-semibold my-8'>
            Chưa có sản phẩm nào trong giỏ hàng
          </p>
          <p
            onClick={() => {
              router.back();
            }}
            className='cursor-pointer text-blue-600 text-center'>
            Quay lại trang trước <i className='bi bi-arrow-return-left'></i>
          </p>
        </div>
      )}
    </div>
  );
}
