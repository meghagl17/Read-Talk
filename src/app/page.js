'use client';

import Image from "next/image";
import { currentUser, useUser } from "@clerk/nextjs";

export default function Home() {
  const { isSignedIn, user } = useUser();

  console.log(user);
  return (
    <div>Home</div>
  );
}
