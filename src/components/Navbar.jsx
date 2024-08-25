'use client';

import React from 'react';
import Link from 'next/link';
import { UserButton, useAuth } from '@clerk/nextjs';
import { Pacifico, Anton } from 'next/font/google'
import Image from 'next/image';
import BookTalk from '../../public/logo.png';

const pacifico = Pacifico({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
})

const anton = Anton({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
})

export function Navbar() {
  const { isLoaded, userId } = useAuth();

  return (
    <div className="w-full pr-4 shadow-lg" style={{ backgroundColor: '#c6e5f3' }}>
      <div className="flex flex-row justify-between items-center max-w-7xl mx-auto">
        {/* Brand Name */}
        <Link href="/"><h3 className={`${pacifico.className} flex items-center justify-center croll-m-20 text-3xl font-extrabold text-white tracking-tight`} style={{color: '#3b4a73', height: '100px'}}>
          <Image
            src={BookTalk}
            alt="BookTalk Logo"
            className="object-cover object-center w-full h-full"
            priority
          />
          BookTalk
        </h3></Link>

        {/* Links */}
        <div className="flex items-center space-x-8">
          {!userId ? (
            <div className="flex items-center space-x-4">
              <Link href="/sign-in" passHref>
                <div className={`${anton.className} text-2lg font-medium px-4 py-2 rounded-lg shadow-lg hover:bg-blue-600 transition-colors duration-300`}
                  style={{ backgroundColor: '#ffffff', color: '#3b4a73' }}>
                  Login
                </div>
              </Link>

              <Link href="/sign-up" passHref>
                <div className={`${anton.className} text-2lg font-medium px-4 py-2 rounded-lg shadow-lg hover:bg-blue-600 transition-colors duration-300`}
                  style={{ backgroundColor: '#ffffff', color: '#3b4a73' }}>
                  Sign up
                </div>
              </Link>
            </div>
          ) : (
            <div className="flex items-center space-x-6">
              <Link href="/books" passHref>
                <div className={`${anton.className} cursor-pointer hover:text-gray-200 transition-colors duration-300`} style={{color: '#3b4a73'}}>
                  Home
                </div>
              </Link>
              {/* <Link href="/profile" passHref>
                <div className="text-white text-lg cursor-pointer hover:text-gray-200 transition-colors duration-300">
                  Profile
                </div>
              </Link> */}
              <div className="bg-white p-1 rounded-full shadow-md hover:shadow-xl transition-shadow duration-300 min-height-40px">
                <UserButton afterSignOutUrl="/" />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
