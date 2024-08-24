'use client';

import React from 'react';
import Link from 'next/link';
import { UserButton, useAuth } from '@clerk/nextjs';

export function Navbar() {
  const { isLoaded, userId } = useAuth();

  return (
    <div className="w-full bg-gradient-to-r from-blue-700 via-blue-600 to-blue-500 p-4 shadow-lg">
      <div className="flex flex-row justify-between items-center max-w-7xl mx-auto">
        {/* Brand Name */}
        <h3 className="scroll-m-20 text-3xl font-extrabold text-white tracking-tight">
          BookTalk
        </h3>

        {/* Links */}
        <div className="flex items-center space-x-8">
          <Link href="/" passHref>
            <div className="text-white text-lg cursor-pointer hover:text-gray-200 transition-colors duration-300">
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
