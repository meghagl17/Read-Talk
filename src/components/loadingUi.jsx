import React from 'react';

const loadingUI = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <div
        className="relative w-16 h-16 border-4 border-[#3b4a73] border-t-transparent rounded-full animate-spin"
        style={{ animationDuration: '1s' }}
      >
        <div
          className="absolute inset-0 border-4 border-[#3b4a73] border-t-transparent rounded-full animate-spin"
          style={{ animationDuration: '1s' }}
        ></div>
      </div>
    </div>
  );
};

export default loadingUI;
