import React from 'react';
import { Link } from 'react-router-dom';

const Layout = ({ children }) => {
  return (
    <div className='flex flex-col min-h-screen bg-green-500'>
      <header>
        <nav className='flex justify-between items-center p-4 bg-gray-900 text-white'>
          {/* Add navigation links here */}

          <h1 className='text-2xl font-bold'>LinkedIn Clone</h1>
          <ul className='flex space-x-4'>
            <li>
              <Link to='/SignIn'>Sign In</Link>
            </li>
            <li>
              <Link to='/SignUp'>Sign Up</Link>
            </li>
          </ul>
        </nav>
      </header>
      <main className='flex-1 p-4'>{children}</main>
      <footer>p{new Date().getFullYear()} &copy; All rights reserved</footer>
    </div>
  );
};

export default Layout;
