'use client';
import axios from 'axios';
import useSWR from 'swr';
import { Select, SelectItem } from '@nextui-org/react';
import { useEffect, useState } from 'react';
// const fetcherCity = (url: string) => axios.get(url).then((r) => r.data);

export default function ProvincesVietNamPage() {
  // const { data, error } = useSWR(
  //   process.env.NEXT_PUBLIC_PROVINCES_VIETNAM,
  //   fetcherCity
  // );
  const [selectedCity, setSelectedCity] = useState('chon_tinh_thanh_pho');
  const [selectedDistrict, setSelectedDistrict] = useState('chon_quan_huyen');
  const [selectedWard, setSelectedWard] = useState('chon_phuong_xa');
  const [data, setData] = useState<any>(undefined);
  useEffect(() => {
    const fetcherCity = async () => {
      try {
        const res = await axios({
          method: 'get',
          url: process.env.API_PROVINCES_VIETNAM,
          headers: {
            'Content-type': 'application/json',
          },
        });

        setData(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetcherCity();
  }, []);
  const handleSelectionChangeCity = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    if (e.target.value === '') {
      setSelectedCity('chon_tinh_thanh_pho');
    } else {
      setSelectedCity(e.target.value);
    }
    setSelectedDistrict('chon_quan_huyen');
    setSelectedWard('chon_phuong_xa');
  };
  const handleSelectionChangeDistrict = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    if (e.target.value === '') {
      setSelectedDistrict('chon_quan_huyen');
    } else {
      setSelectedDistrict(e.target.value);
    }
    setSelectedWard('chon_phuong_xa');
  };
  const handleSelectionChangeWard = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    if (e.target.value === '') {
      setSelectedWard('chon_phuong_xa');
    } else {
      setSelectedWard(e.target.value);
    }
  };

  console.log(data);
  return (
    <div className='flex w-full max-w-xs flex-col gap-2'>
      <Select
        label='Tỉnh/ Thành phố'
        variant='bordered'
        placeholder='Chọn Tỉnh/ Thành phố'
        selectedKeys={[selectedCity]}
        className='w-[400px]'
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
        className='max-w-xs'
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
        className='max-w-xs'
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
      <p className='text-small text-default-500'>
        Tỉnh/ Thành phố:{' '}
        {selectedCity !== 'chon_tinh_thanh_pho' && data[selectedCity]['name']}
      </p>
      <p className='text-small text-default-500'>
        Quận/ Huyện:
        {selectedDistrict !== 'chon_quan_huyen' &&
          data[selectedCity].districts[selectedDistrict]['name']}
      </p>

      <p className='text-small text-default-500'>
        Phường/ Xã:
        {selectedWard !== 'chon_phuong_xa' &&
          data[selectedCity].districts[selectedDistrict].wards[selectedWard][
            'name'
          ]}
      </p>
    </div>
  );
}
