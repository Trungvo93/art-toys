'use client';
import axios from 'axios';
import useSWR from 'swr';
import { Button, Input, Select, SelectItem } from '@nextui-org/react';
import { useEffect, useState } from 'react';
import { Province } from './DefiningTypes';
const fetcherCity = (url: string) => axios.get(url).then((r) => r.data);

export default function ProvincesVietNamPage(props: any) {
  const { data, error } = useSWR(
    `https://citys.open-api.vn/api/?depth=3`,
    fetcherCity
  );

  const [selectedCity, setSelectedCity] = useState('chon_tinh_thanh_pho');
  const [selectedDistrict, setSelectedDistrict] = useState('chon_quan_huyen');
  const [selectedWard, setSelectedWard] = useState('chon_phuong_xa');

  const [street, setStreet] = useState('');
  const [isInvalidStreet, setIsInvalidStreet] = useState(false);
  const [ignoreFistCheck, setIgnoreFistCheck] = useState(false);

  useEffect(() => {
    setIgnoreFistCheck(true);
  }, []);
  useEffect(() => {
    props.addressCallback({
      city: props.addressData.city,
      districts: props.addressData.districts,
      wards: props.addressData.wards,
      street: street,
    });
  }, [street]);
  const handleSelectionChangeCity = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    if (e.target.value === '') {
      setSelectedCity('chon_tinh_thanh_pho');
      props.addressCallback({
        city: '',
        districts: '',
        wards: '',
        street: street,
      });
    } else {
      setSelectedCity(e.target.value);
      props.addressCallback({
        city: data[e.target.value]['name'],
        districts: '',
        wards: '',
        street: street,
      });
    }
    setSelectedDistrict('chon_quan_huyen');
    setSelectedWard('chon_phuong_xa');
  };
  const handleSelectionChangeDistrict = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    if (e.target.value === '') {
      setSelectedDistrict('chon_quan_huyen');
      props.addressCallback({
        city: props.addressData.city,
        districts: '',
        wards: '',
        street: street,
      });
    } else {
      setSelectedDistrict(e.target.value);
      props.addressCallback({
        city: props.addressData.city,
        districts: data[selectedCity].districts[e.target.value]['name'],
        wards: '',
        street: street,
      });
    }
    setSelectedWard('chon_phuong_xa');
  };
  const handleSelectionChangeWard = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    if (e.target.value === '') {
      setSelectedWard('chon_phuong_xa');
      props.addressCallback({
        city: props.addressData.city,
        districts: props.addressData.districts,
        wards: '',
        street: street,
      });
    } else {
      setSelectedWard(e.target.value);
      props.addressCallback({
        city: props.addressData.city,
        districts: props.addressData.districts,
        wards:
          data[selectedCity].districts[selectedDistrict].wards[e.target.value][
            'name'
          ],
        street: street,
      });
    }
  };

  console.log(props.addressData);
  console.log('selectedCity: ', selectedCity);
  return (
    <div className='grid w-full   gap-4'>
      <Input
        value={street}
        onValueChange={setStreet}
        isInvalid={isInvalidStreet}
        errorMessage={isInvalidStreet && 'Địa chỉ không được để trống'}
        radius='none'
        color={isInvalidStreet ? 'danger' : 'default'}
        label='Địa chỉ'
        type='text'
        className='w-full'
      />

      <Select
        label='Tỉnh/ Thành phố'
        variant='bordered'
        placeholder='Chọn Tỉnh/ Thành phố'
        selectedKeys={[selectedCity]}
        className='w-full'
        radius='none'
        onChange={(e) => {
          handleSelectionChangeCity(e);
        }}>
        <SelectItem
          key={'chon_tinh_thanh_pho'}
          value={'chon_tinh_thanh_pho'}>
          Chọn Tỉnh/ Thành phố
        </SelectItem>
        {data &&
          data.map((item: any, index: number) => (
            <SelectItem
              key={index}
              value={item.name}>
              {item.name}
            </SelectItem>
          ))}
      </Select>

      <Select
        label='Quận/ Huyện'
        variant='bordered'
        placeholder='Chọn Quận/ Huyện'
        className='w-full'
        radius='none'
        selectedKeys={[selectedDistrict]}
        onChange={handleSelectionChangeDistrict}>
        <SelectItem
          key={'chon_quan_huyen'}
          value={'chon_quan_huyen'}>
          Chọn Quận/ Huyện
        </SelectItem>
        {selectedCity !== 'chon_tinh_thanh_pho' &&
          data[selectedCity]['districts'].map((item: any, index: number) => (
            <SelectItem
              key={index}
              value={item.name}>
              {item.name}
            </SelectItem>
          ))}
      </Select>

      <Select
        label='Phường/ Xã'
        variant='bordered'
        placeholder='Chọn Phường/ Xã'
        className='w-full'
        radius='none'
        selectedKeys={[selectedWard]}
        onChange={handleSelectionChangeWard}>
        <SelectItem
          key={'chon_phuong_xa'}
          value={'chon_phuong_xa'}>
          Chọn Phường/ Xã
        </SelectItem>
        {selectedDistrict !== 'chon_quan_huyen' &&
          data[selectedCity]['districts'][selectedDistrict]['wards'].map(
            (item: any, index: number) => (
              <SelectItem
                key={index}
                value={item.name}>
                {item.name}
              </SelectItem>
            )
          )}
      </Select>
    </div>
  );
}
