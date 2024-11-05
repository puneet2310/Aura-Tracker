import React, { useState } from 'react';
import { Container, Logo, LogoutButton } from '../index';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import DropdownMenu from './DropdownMenu';

function Header() {
  const authStatus = useSelector((state) => state.auth.status);
  const userData = useSelector((state) => state.auth.userData);
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  const avatar = userData?.avatar || '/path/to/default-avatar.png'; // Fallback for avatar
  const navItems = [
    {
      name: 'Home',
      slug: '/',
      active: true,
    },
    {
      name: 'About Us',
      slug: '/about',
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

  const isActive = (slug) => window.location.pathname === slug; // Check if the route is active

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
                  className={`inline-block px-6 py-2 transition duration-200 transform hover:scale-90 hover:bg-slate-600 rounded-full ${
                    isActive(item.slug) ? 'bg-slate-600 text-white' : 'text-gray-300'
                  }`}
                  aria-label={`Navigate to ${item.name}`} // Accessibility improvement
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
                    alt='User avatar' // Improved alt text for accessibility
                    className='mr-4 w-10 h-10 rounded-full object-cover border border-gray-400'
                  />
                </button>
                {showDropdown && <DropdownMenu />} 
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
}

export default Header;
