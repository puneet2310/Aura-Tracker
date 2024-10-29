import React, { useState } from 'react';
import { Container, Logo, LogoutButton } from '../index';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import DropdownMenu from './DropdownMenu';
// import './Header.css'
// import {Container, Logo, LogoutButton} from '../index.js'
function Header() {
  const authStatus = useSelector((state) => state.auth.status);
  const userData = useSelector((state) => state.auth.userData);
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  
  const avatar = userData?.avatar;
  const navItems = [
    {
      name: 'Home',
      slug: '/',
      active: true,
    },
    {
      name: 'About Us',
      slug: '/about-us',
      active: true,
    },
    {
      name: 'Login',
      slug: '/login',
      active: !authStatus,
    },
    {
      name: 'Signup',
      slug: '/signup',
      active: !authStatus,
    },
    {
      name: 'Dashboard',
      slug: '/dashboard',
      active: authStatus,
    },
  ];


  return (
    <header className='py-3 shadow bg-gray-900'>
      <nav className='flex items-center'>
        <div className='mr-4'>
          <Link to='/'>
            <Logo width='70px' />
          </Link>
        </div>
        <ul className='flex ml-auto relative'>
          {navItems.map((item) =>
            item.active ? (
              <li key={item.name} className='relative'>
                <button
                  onClick={() => navigate(item.slug)}
                  className='inline-block px-6 py-2 transition duration-200 transform hover:scale-90
                   hover:bg-slate-600 hover:text-white rounded-full text-gray-300'
                >
                  {item.name}
                </button>
              </li>
            ) : null
          )}
          {authStatus && (
            <>
              <li className='ml-4'>
                <LogoutButton />
              </li>
              {/* Display Avatar on Right Side */}
              <li className='ml-4 flex items-center'>
                <button onClick={() => setShowDropdown(!showDropdown)} className='focus:outline-none'>
                  <img
                    src={avatar}
                    alt='Profile'
                    className='w-10 h-10 rounded-full object-cover border border-gray-400'
                  />
                </button>
                {/* {showDropdown && <DropdownMenu />} Optional dropdown on avatar click */}
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
}

export default Header;
