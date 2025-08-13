import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FcBullish } from 'react-icons/fc';

import LogoutButton from './LogoutButton';

function Header() {
  const authStatus = useSelector((s) => s.auth.status);
  const userData   = useSelector((s) => s.auth.userData);
  const navigate   = useNavigate();
  const location   = useLocation();
  const [showDropdown, setShowDropdown] = useState(false);

  const avatar = userData?.avatar || '/path/to/default-avatar.png';

  const navItems = [
    { name: 'Home',      slug: '/',             active: true  },
    { name: 'About Us',  slug: '/about',        active: true  },
    { name: 'Login',     slug: '/login',        active: !authStatus },
    { name: 'Signup',    slug: '/signup',       active: !authStatus },
    { name: 'Dashboard', slug: '/dashboard',    active: authStatus  },
  ];

  const dropdownItems = [
    { name: 'Profile',   slug: '/dashboard/profile' },
    { name: 'Settings',  slug: '/dashboard/settings' },
    { name: 'Contact Us',slug: '/dashboard/contact' },
  ];

  const isDashboard = location.pathname.startsWith('/dashboard');
  const isActive    = (slug) => location.pathname === slug;

  // shared dropdown link styling
  const itemClasses = `
    block px-4 py-2
    hover:bg-indigo-600 hover:text-white
    transition duration-200
    rounded
  `;

  return (
    <header className="bg-white shadow-md z-50 border-b border-gray-300">
      <nav className="container mx-auto px-4 flex items-center justify-between">

        {!isDashboard && (
          <div className="mr-4 flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/')}>
            <span className="text-2xl font-bold text-gray-800">Pro-Track</span>
            <FcBullish className='flex justify-center items-center' fontSize={32} />
          </div>
        )}

        <div className={`${isDashboard ? 'flex-1 flex justify-center' : 'ml-auto'} pt-3 pb-1 space-x-4`}>
          <ul className="flex space-x-4">
            {navItems.filter(i => i.active).map(item => (
              <li key={item.name}>
                <button
                  onClick={() => navigate(item.slug)}
                  className={`px-3 py-2 rounded-md transition ${
                    isActive(item.slug)
                      ? 'bg-indigo-500 text-white'
                      : 'text-black hover:bg-gray-100 hover:text-indigo-500'
                  }`}
                >
                  {item.name}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {authStatus && (
          <div className="relative ml-4">
            <button
              onClick={() => setShowDropdown(o => !o)}
              className="focus:outline-none"
            >
              <img
                src={avatar}
                alt="User avatar"
                className="w-10 h-10 rounded-full object-cover border border-gray-200"
              />
            </button>

            {showDropdown && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200">
                <ul className="text-gray-700">
                  {dropdownItems.map(item => (
                    <li key={item.name}>
                      <Link
                        to={item.slug}
                        onClick={() => setShowDropdown(false)}
                        className={itemClasses}
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}

                  {/* divider */}
                  <li><hr className="my-1 border-gray-300" /></li>

                  {/* Logout as matching dropdown item */}
                  <li>
                    <LogoutButton className={itemClasses} />
                  </li>
                </ul>
              </div>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}

export default Header;
