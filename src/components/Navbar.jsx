'use client';

import React from 'react';
import Link from 'next/link';
import { UserButton, useAuth } from '@clerk/nextjs';
import { Pacifico, Anton } from 'next/font/google';
import Image from 'next/image';
import BookTalk from '../../public/BookTalkLogo.png';
import { User } from 'lucide-react';

const pacifico = Pacifico({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
});

const anton = Anton({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
});

export function Navbar() {
  const { isLoaded, userId } = useAuth();

  return (
    <div className="w-full shadow-lg" style={{ backgroundColor: '#c6e5f3' }}>
      <div className="flex justify-between items-center w-full max-w-7xl mx-auto px-4 py-2">
        {/* Brand Name */}
        <Link href="/">
          <div className="flex items-center">
            {/* Show text instead of logo on small screens */}
            <h3 className={`${pacifico.className} text-2xl lg:hidden`} style={{ color: '#3b4a73' }}>
              BookTalk
            </h3>
            {/* Show logo on larger screens */}
            <div className="hidden lg:flex items-center">
              <Image src={BookTalk} alt="BookTalk Logo" width={50} height={50} />
              <h3 className={`${pacifico.className} text-2xl ml-3`} style={{ color: '#3b4a73' }}>
                BookTalk
              </h3>
            </div>
          </div>
        </Link>

        {/* Links */}
        <div className="flex items-center space-x-6">
          {!userId ? (
            <div className="flex items-center space-x-4">
              <Link href="/sign-in" passHref>
                <div className="flex items-center space-x-1">
                  <User />
                  <div className={`${anton.className} text-lg`} style={{ color: '#3b4a73' }}>
                    Login
                  </div>
                </div>
              </Link>

              <Link href="/sign-up" passHref>
                <div className={`${anton.className} text-lg font-medium px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-300`} style={{ backgroundColor: '#ffffff', color: '#3b4a73' }}>
                  Sign up
                </div>
              </Link>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link href="/books" passHref>
                <div className={`${anton.className} cursor-pointer hover:text-gray-200 transition-colors duration-300`} style={{ color: '#3b4a73' }}>
                  Home
                </div>
              </Link>
              <div className="bg-white p-1 rounded-full shadow-md hover:shadow-xl transition-shadow duration-300">
                <UserButton afterSignOutUrl="/" />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
