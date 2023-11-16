'use client';
import axios from 'axios';
import useSWR from 'swr';
import { Select, SelectItem } from '@nextui-org/react';
import { useState } from 'react';
const fetcherCity = (url: string) => fetch(url).then((r) => r.json());

export default function ProvincesVietNamPage() {
  const { data, error } = useSWR(
    process.env.NEXT_PUBLIC_PROVINCES_VIETNAM,
    fetcherCity
  );
  const [indexCity, setIndexCity] = useState('');
  const [indexDistrict, setIndexDistrict] = useState('');
  const [indexWard, setIndexWard] = useState('');

  const handleSelectionChangeCity = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setIndexWard('');
    setIndexDistrict('');
    setIndexCity(e.target.value);
  };
  const handleSelectionChangeDistrict = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setIndexDistrict(e.target.value);
    setIndexWard('');
  };
  const handleSelectionChangeWard = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setIndexWard(e.target.value);
  };
  console.log(indexCity.length > 0 && data[indexCity]);
  console.log(
    indexDistrict.length > 0 && data[indexCity].districts[indexDistrict]
  );

  return (
    <div className='flex w-full max-w-xs flex-col gap-2'>
      <Select
        label='Tỉnh/ Thành phố'
        variant='bordered'
        placeholder='Chọn Tỉnh/ Thành phố'
        className='max-w-xs'
        selectedKeys={indexCity}
        radius='none'
        onChange={handleSelectionChangeCity}>
        {data &&
          data.map((item: any, index: number) => (
            <SelectItem
              key={index}
              value={item.codename}>
              {item.name}
            </SelectItem>
          ))}
      </Select>

      <Select
        label='Quận/ Huyện'
        variant='bordered'
        placeholder='Chọn Quận/ Huyện'
        className='max-w-xs'
        radius='none'
        selectedKeys={indexDistrict}
        onChange={handleSelectionChangeDistrict}>
        {indexCity.length > 0 &&
          data[indexCity]['districts'].map((item: any, index: number) => (
            <SelectItem
              key={index}
              value={item.codename}>
              {item.name}
            </SelectItem>
          ))}
      </Select>

      <Select
        label='Phường/ Xã'
        variant='bordered'
        placeholder='Chọn Phường/ Xã'
        className='max-w-xs'
        radius='none'
        selectedKeys={indexWard}
        onChange={handleSelectionChangeWard}>
        {indexDistrict.length > 0 &&
          data[indexCity]['districts'][indexDistrict]['wards'].map(
            (item: any, index: number) => (
              <SelectItem
                key={index}
                value={item.codename}>
                {item.name}
              </SelectItem>
            )
          )}
      </Select>
      <p className='text-small text-default-500'>
        Tỉnh/ Thành phố: {indexCity.length > 0 && data[indexCity]['name']}
      </p>
      <p className='text-small text-default-500'>
        Quận/ Huyện:
        {indexDistrict.length > 0 &&
          data[indexCity].districts[indexDistrict]['name']}
      </p>

      <p className='text-small text-default-500'>
        Phường/ Xã:
        {indexWard.length > 0 &&
          data[indexCity].districts[indexDistrict].wards[indexWard]['name']}
      </p>
    </div>
  );
}
