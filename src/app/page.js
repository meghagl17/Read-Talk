'use client';

import { useRouter } from 'next/navigation';
import { Pacifico, Anton } from 'next/font/google';
import Image from 'next/image';
import BookTalk from '../../public/logo.png';

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

const HomePage = () => {
  const router = useRouter();

  const navigateToHome = () => {
    router.push('/books');
  };

  return (
    <div className="flex flex-col items-center justify-center">

      {/* Tagline and Call-to-Action Button */}
      <div className="flex flex-row items-center justify-center p-6">
        <div className="text-left max-w-xl">
          <h1 className={`${anton.className} text-5xl font-extrabold text-gray-800 mb-4`}>
            Welcome to BookTalk!
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Discover and discuss your favorite books with our vibrant community.
          </p>
          <button
            onClick={navigateToHome}
            className={`${pacifico.className} text-xl font-semibold px-6 py-3 rounded-lg border-2 border-gray-800 text-gray-800 hover:bg-gray-100 transition-colors duration-300`}
            style={{ borderColor: '#3b4a73', color: '#3b4a73' }}
          >
            Home
          </button>
        </div>

        {/* Logo */}
        <div className="relative w-full flex justify-center mb-8 overflow-hidden">
          <Image
            src={BookTalk}
            alt="BookTalk Logo"
            className="object-cover object-center w-full h-[400px] max-w-3xl"
            priority
          />
        </div>
      </div>

    </div>
  );
};

export default HomePage;
