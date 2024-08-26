'use client';

import { useRouter } from 'next/navigation';
import { Pacifico, Anton } from 'next/font/google';
import Image from 'next/image';
import BookTalk from '../../public/BookTalk (2).png';
import feature1 from '../../public/feature1.png';
import feature2 from '../../public/feature2.png';
import feature3 from '../../public/feature3.png';
import feature4 from '../../public/feature4.png';
import bookmark from '../../public/bookmark.png';

import { Bookmark } from 'lucide-react';
import ContactForm from '../components/ContactForm.js'

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
    <>
    <div className="flex w-full h-full flex-col">

    <div className="flex flex-col lg:flex-row items-center justify-between p-6 bg-[#c6e5f3]">
      {/* Logo Section for Mobile */}
      <div className="lg:hidden mb-6 w-full flex justify-center">
        <Image
          src={BookTalk}
          alt="BookTalk Logo"
          className="object-cover object-center w-3/4 h-auto"
          priority
        />
      </div>

      {/* Text Content Section */}
      <div className="text-center lg:text-left max-w-xl lg:w-1/2 lg:pl-40">
        <h1 className={`${anton.className} text-3xl lg:text-5xl font-extrabold text-gray-800 mb-4`} style={{ color: '#2e3b5f' }}>
          Welcome to BookTalk!
        </h1>
        <p className="text-base lg:text-lg text-gray-600 mb-6">
          Discover and delve into your favorite books like never before. Our platform not only lets you search for and explore a vast library but also offers a space to post and answer discussion questions, fostering meaningful conversations with fellow readers. Join us to share your insights and connect with a community passionate about books.
        </p>
        <button
          onClick={navigateToHome}
          className={`${pacifico.className} text-base lg:text-xl font-semibold px-4 lg:px-6 py-2 lg:py-3 rounded-lg border-2 border-gray-800 text-gray-800 hover:bg-gray-100 transition-colors duration-300`}
          style={{ borderColor: '#3b4a73', color: '#3b4a73' }}
        >
          Home
        </button>
      </div>

      {/* Logo Section for Desktop */}
      <div className="hidden lg:flex lg:w-1/2 justify-center mb-8">
        <Image
          src={BookTalk}
          alt="BookTalk Logo"
          className="object-cover object-center w-3/4 h-auto"
          priority
        />
      </div>
    </div>

      <div className="relative w-full p-4 lg:p-8 bg-[#f0faff]">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-8">
        {/* Book Images */}
        <div className="flex justify-center items-center">
          <Image
            src={feature1}
            alt="Discuss your favorite books"
            className="object-cover object-center w-full h-auto"
            priority
          />
        </div>

        <div className="flex justify-center items-center">
          <Image
            src={feature4}
            alt="Discuss your favorite books"
            className="object-cover object-center w-full h-auto"
            priority
          />
        </div>

        <div className="flex justify-center items-center">
          <Image
            src={feature3}
            alt="Discuss your favorite books"
            className="object-cover object-center w-full h-auto"
            priority
          />
        </div>

        <div className="flex justify-center items-center">
          <Image
            src={feature2}
            alt="Discuss your favorite books"
            className="object-cover object-center w-full h-auto"
            priority
          />
        </div>
      </div>
    </div>

      {/* Coming Soon Section */}
      <div className="flex flex-col items-center justify-center">
        {/* Main Heading */}
        <div className="text-center" style={{ backgroundColor: '#99c8dd' }}>
          <h2 className="text-6xl font-extrabold text-gray-800 mb-2" style={{ color: '#2e3b5f' }}>Coming Soon...</h2>
          <p className="text-xl text-gray-600">Im excited to share some new upcoming features with you!</p>
          
        </div>

      </div>
    </div>
      <div className="w-full" style={{ backgroundColor: '#c6e5f3' }}>
        <ContactForm />
      </div>
    </>
  );
};

export default HomePage;
