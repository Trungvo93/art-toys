'use client';
import Image from 'next/image';
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Button,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Tooltip,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Badge,
  Input,
  Accordion,
  AccordionItem,
} from '@nextui-org/react';
import { useState } from 'react';
import Link from 'next/link';
export default function TopHeadPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCompact, setIsCompact] = useState(false);
  const [selectedKeys, setSelectedKeys] = useState('');
  return (
    <div className='fixed w-full bg-white shadow-lg'>
      <div className='flex w-full justify-between items-center p-6'>
        {/* Show menu */}
        <div>
          <Navbar
            onMenuOpenChange={setIsMenuOpen}
            className='bg-transparent '>
            <Tooltip
              offset={-10}
              showArrow
              placement='bottom'
              content={isMenuOpen ? 'Close' : 'Menu'}
              color='danger'>
              <NavbarContent
                className=''
                justify='start'>
                <NavbarMenuToggle
                  aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
                  className=''
                />
              </NavbarContent>
            </Tooltip>
            <NavbarMenu className='mt-12 bg-white'>
              <NavbarMenuItem>
                <Link href={'#'}>Best seller</Link>
              </NavbarMenuItem>
              <NavbarMenuItem>
                <Link href={'#'}>All products</Link>
              </NavbarMenuItem>
              <NavbarMenuItem>
                <Accordion onSelectionChange={() => {}}>
                  <AccordionItem
                    onFocus={() => {
                      setSelectedKeys('Blind box');
                    }}
                    key='1'
                    aria-label='Blind box'
                    title={
                      <span
                        className={
                          selectedKeys == 'Blind box' ? 'text-red-600' : ''
                        }>
                        Blind box
                      </span>
                    }
                    className={`-mx-2  `}>
                    <div className='bg-yellow-200'>
                      <p>Pop mart</p>
                      <p>Heyone</p>
                      <p>Other art toys</p>
                    </div>
                  </AccordionItem>
                </Accordion>
              </NavbarMenuItem>
              <NavbarMenuItem>
                <Accordion
                  onSelectionChange={() => {
                    setSelectedKeys('Figuring');
                  }}>
                  <AccordionItem
                    key='2'
                    aria-label='Figuring'
                    title={
                      <span
                        className={
                          selectedKeys == 'Figuring' ? 'text-red-600' : ''
                        }>
                        Figuring
                      </span>
                    }
                    className={`-mx-2  `}>
                    <p>Bandai</p>
                    <p>Gundam</p>
                  </AccordionItem>
                </Accordion>
              </NavbarMenuItem>
              <NavbarMenuItem>
                <span>About</span>
              </NavbarMenuItem>
              <NavbarMenuItem>
                <span>Socials</span>
              </NavbarMenuItem>
            </NavbarMenu>
          </Navbar>
        </div>

        {/* Logo */}
        <div>
          <Tooltip
            showArrow
            placement='bottom'
            content='Trang chủ'
            color='danger'>
            <Link href='/'>
              <Image
                src={'/assets/header/logo2.png'}
                alt='Logo'
                priority
                width={200}
                height={0}
                className='w-48 h-auto object-cover'
              />
            </Link>
          </Tooltip>
        </div>

        {/* RightSide */}
        <div className='flex gap-4'>
          {/* Search */}
          <Popover
            placement='bottom'
            showArrow={true}>
            <PopoverTrigger>
              <Button
                color='default'
                variant='light'
                isIconOnly>
                <i className='bi bi-search text-xl'></i>
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <div className='px-1 py-2 '>
                <Input
                  classNames={{
                    base: 'max-w-full w-[500px] h-10',
                    mainWrapper: 'h-full',
                    input: 'text-small',
                    inputWrapper:
                      'h-full font-normal text-default-500 bg-default-400/20 dark:bg-default-500/20',
                  }}
                  placeholder='Tìm kiếm tên sản phẩm...'
                  size='sm'
                  startContent={<i className='bi bi-search text-xl'></i>}
                  type='search'
                />
              </div>
            </PopoverContent>
          </Popover>

          {/* User */}
          <Tooltip
            showArrow
            placement='bottom'
            content='Tài khoản'
            color='danger'>
            <Button
              color='default'
              variant='light'
              isIconOnly>
              <i className='bi bi-person text-2xl'></i>
            </Button>
          </Tooltip>

          {/* Cart */}

          <Popover
            placement='bottom'
            showArrow={true}>
            <PopoverTrigger>
              <Tooltip
                showArrow
                placement='bottom'
                content='Giỏ hàng'
                color='danger'>
                <Button
                  color='default'
                  variant='light'
                  isIconOnly>
                  <Badge
                    content='5'
                    color='danger'
                    shape='circle'
                    size='sm'>
                    <i className='bi bi-bag-plus text-xl'></i>
                  </Badge>
                </Button>
              </Tooltip>
            </PopoverTrigger>
            <PopoverContent>
              <div className='px-1 py-2 '>
                <div className='text-small font-bold'>Popover Content</div>
                <div className='text-tiny'>This is the popover content</div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
}
