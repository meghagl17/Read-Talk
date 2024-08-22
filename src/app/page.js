"use client"

import { useRouter } from 'next/navigation';

const HomePage = () => {
  const router = useRouter();

  const navigateToBooks = () => {
    router.push('/books');
  };

  return (
    <div>
      <h1>Home Page</h1>
      <button onClick={navigateToBooks}>browse books</button>
      {/* Add your books page content here */}
    </div>
  );
};

export default HomePage;