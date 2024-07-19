'use client';

import React from 'react'
import Link from 'next/link'
import { UserButton, auth, useAuth } from "@clerk/nextjs"
import {
    SignInButton,
    SignOutButton,
    SignedIn,
    SignedOut,
    useUser,
  } from "@clerk/nextjs";

export function Navbar() {
    const { isLoaded, userId } = useAuth();
    // const isAuth = !!userId;

    return (
        <div className="w-full border-b px-6 py-3">
            <div className="flex flex-row justify-between items-center">
                <h3 className="scroll-m-20 text-xl font-semibold tracking-tight">
                    ReadTalk
                </h3>
                <div>
                    <Link href="/">
                        Home
                    </Link>
                </div>
                <div className="flex gap-10">
                    {!userId ? (
                        <>
                            <Link href="/sign-in">
                                Login
                            </Link>

                            <Link href="/sign-up">
                                Sign up
                            </Link>
                        </>
                    ):(
                        <div>
                            <Link href="/profile">
                                Profile
                            </Link>
                            <UserButton afterSignOutUrl="/" />
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
