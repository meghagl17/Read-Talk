import React from "react";
import Link from "next/link";

export default function Header(){
    return(
        <div>
            <Link href='/sign-up'>Sign-up</Link>
            <Link href='/sign-in'>Sign-in</Link>
        </div>
    );
}