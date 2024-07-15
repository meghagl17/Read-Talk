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
        <div>
            <ul className="flex justify-between m-10 items-center">
                <div>
                    <Link href="/">
                        <li>Home</li>
                    </Link>
                </div>
                <div className="flex gap-10">
                    {!userId ? (
                        <>
                            <Link href="/sign-in">
                                <li>Login</li>
                            </Link>

                            <Link href="/sign-up">
                                <li>Sign up</li>
                            </Link>
                        </>
                    ):(
                        <>
                            <Link href="/profile">
                                <li>Profile</li>
                            </Link>
                            <li> <UserButton afterSignOutUrl="/" /></li>
                        </>
                    )}
                </div>
            </ul>
        </div>
    )
}
