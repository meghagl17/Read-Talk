'use client';

import { useRouter } from 'next/navigation';
import { Pacifico, Anton } from 'next/font/google';
import Image from 'next/image';
import BookTalk from '../../public/BookTalk (2).png';
import book from '../../public/Discuss your favorite books.png';
import { Bookmark } from 'lucide-react';

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

  const features = [
    "Advanced Stats and Insights",
    "Top-rated books on the app",
    "Personalized recommendations",
  ];

  return (
    <div className="flex w-full h-full flex-col">

      {/* Container for Tagline and Logo Side by Side */}
      <div className="flex flex-row items-center justify-center p-6" style={{ backgroundColor: '#c6e5f3' }}>
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

        {/* BookTalk Logo beside the Tagline */}
        <div className="relative w-1/2 flex justify-center mb-8 overflow-hidden max-w-lg">
          <Image
            src={BookTalk}
            alt="BookTalk Logo"
            className="object-cover object-center w-full h-auto"
            priority
          />
        </div>
      </div>

      {/* Book Image Below */}
      <div className="relative w-full flex justify-center mb-8 items-center" style={{ backgroundColor: '#f0faff' }}>
        {/* First Image */}
        <Image
          src={book}
          alt="Discuss your favorite books"
          className="object-cover object-center w-1/4 h-auto"
          priority
        />

        {/* Vertical Line */}
        <div className="h-32 w-px bg-gray-400 mx-4"></div>

          {/* Second Image */}
          <Image
            src={book}
            alt="Discuss your favorite books"
            className="object-cover object-center w-1/4 h-auto"
            priority
          />

          {/* Vertical Line */}
          <div className="h-32 w-px bg-gray-400 mx-4"></div>

          {/* Third Image */}
          <Image
            src={book}
            alt="Discuss your favorite books"
            className="object-cover object-center w-1/4 h-auto"
            priority
          />
      </div>

      {/* Coming Soon Section */}
      <div className="flex flex-col items-center justify-center">
        {/* Main Heading */}
        <div className="text-center">
          <h2 className="text-6xl font-extrabold text-gray-800 mb-2">Coming Soon</h2>
          <p className="text-xl text-gray-600">I'm excited to share some new upcoming features with you!</p>
        </div>

        {/* Tabs */}
        <div className="w-full max-w-4xl mt-6">
          <div className="flex flex-wrap justify-center gap-4">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center">
                <Bookmark className="mr-2 text-gray-600" />
                <p className="text-lg text-gray-700">{feature}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default HomePage;
