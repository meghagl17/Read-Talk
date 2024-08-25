'use client';

import React from 'react';
import Link from 'next/link';
import { UserButton, useAuth } from '@clerk/nextjs';
import { Pacifico } from 'next/font/google'

const pacifico = Pacifico({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
})

export function Navbar() {
  const { isLoaded, userId } = useAuth();

  return (
    <div className="w-full p-4 shadow-lg" style={{ backgroundColor: '#c6e5f3' }}>
      <div className="flex flex-row justify-between items-center max-w-7xl mx-auto">
        {/* Brand Name */}
        <h3 className={`${pacifico.className} scroll-m-20 text-3xl font-extrabold text-white tracking-tight`} style={{color: '#3b4a73'}}>
          BookTalk
        </h3>

        {/* Links */}
        <div className="flex items-center space-x-8">
          <Link href="/" passHref>
            <div className={`${pacifico.className} cursor-pointer hover:text-gray-200 transition-colors duration-300`} style={{color: '#3b4a73'}}>
              Home
            </div>
          </Link>

          {!userId ? (
            <div className="flex space-x-6">
              <Link href="/sign-in" passHref>
                <div className="text-white text-lg cursor-pointer hover:text-gray-200 transition-colors duration-300">
                  Login
                </div>
              </Link>

              <Link href="/sign-up" passHref>
                <div className="bg-white text-blue-700 font-semibold px-4 py-2 rounded-full shadow-md cursor-pointer hover:bg-gray-100 transition-colors duration-300">
                  Sign up
                </div>
              </Link>
            </div>
          ) : (
            <div className="flex items-center space-x-6">
              {/* <Link href="/profile" passHref>
                <div className="text-white text-lg cursor-pointer hover:text-gray-200 transition-colors duration-300">
                  Profile
                </div>
              </Link> */}
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
