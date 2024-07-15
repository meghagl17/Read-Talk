import React from 'react'
import Link from 'next/link'

export function Navbar() {
    return (
        <div>
            <ul className="flex justify-between m-10 items-center">
                <div>
                    <Link href="/">
                        <li>Home</li>
                    </Link>
                </div>
                <div className="flex gap-10">
                    <Link href="/sign-in">
                        <li>Login</li>
                    </Link>

                    <Link href="/sign-up">
                        <li>Sign up</li>
                    </Link>

                    <Link href="/profile">
                        <li>Profile</li>
                    </Link>
                </div>
            </ul>
        </div>
    )
}