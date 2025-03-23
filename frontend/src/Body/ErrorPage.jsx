import React from 'react';

const ErrorPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-green-200 to-blue-200 p-4 text-gray-800">
      <h1 className="text-5xl font-extrabold animate-bounce">Oops!</h1>
      <p className="text-xl mt-4 text-center">
        Something went wrong or this page does not exist.
      </p>
      <p className="mt-2 text-lg text-center">
        Please check the URL or return to the homepage for more information.
      </p>
      <button 
        onClick={() => window.location.href = '/'} 
        className="mt-6 px-6 py-3 bg-yellow-300 text-gray-800 font-semibold rounded-lg shadow-md hover:bg-yellow-400 transition duration-200 transform hover:scale-105"
      >
        Go Back Home
      </button>
      <footer className="absolute bottom-4 text-sm">
        &copy; {new Date().getFullYear()} FurryFriends. All rights reserved.
      </footer>
    </div>
  );
};

export default ErrorPage;
