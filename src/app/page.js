'use client';

import { useRouter } from 'next/navigation';
import { Pacifico } from 'next/font/google'

const pacifico = Pacifico({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
})

const HomePage = () => {
  const router = useRouter();

  const navigateToBooks = () => {
    router.push('/books');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-50 via-blue-100 to-blue-200 p-6">
      {/* Main Container */}
      <div className="max-w-4xl text-center bg-white p-8 rounded-lg shadow-lg">
        {/* Heading */}
        <h1 className="text-4xl font-extrabold text-gray-800 mb-4">Welcome to BookTalk!</h1>

        {/* Subheading */}
        <p className="text-lg text-gray-600 mb-6">
          Discover and discuss your favorite books with our vibrant community. Explore new titles, share insights, and find your next great read.
        </p>

        {/* Call-to-Action Button */}
        <button
          onClick={navigateToBooks}
          className={`${pacifico.className} text-2lg font-semibold px-6 py-3 rounded-lg shadow-lg hover:bg-blue-600 transition-colors duration-300`}
          style={{ backgroundColor: '#c6e5f3', color: '#3b4a73' }}
        >
          Browse Books
        </button>
      </div>

      {/* Additional Info or Image */}
      <div className="mt-12">
        <img
          src="/path-to-your-image.jpg" // Replace with an actual image path
          alt="Books"
          className="w-full max-w-2xl mx-auto rounded-lg shadow-lg"
        />
      </div>
    </div>
  );
};

export default HomePage;
