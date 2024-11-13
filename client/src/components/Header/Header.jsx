import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FcBullish } from 'react-icons/fc';
import DropdownMenu from './DropdownMenu';

function Header() {
  const authStatus = useSelector((state) => state.auth.status);
  const userData = useSelector((state) => state.auth.userData);
  const navigate = useNavigate();
  const location = useLocation();
  const [showDropdown, setShowDropdown] = useState(false);

  const avatar = userData?.avatar || '/path/to/default-avatar.png';
  console.log(location.pathname)

  const navItems = [
    { name: 'Home', slug: '/', active: true },
    { name: 'About Us', slug: '/about', active: true },
    { name: 'Login', slug: '/login', active: !authStatus },
    { name: 'Signup', slug: '/signup', active: !authStatus },
    { name: 'Dashboard', slug: '/dashboard', active: authStatus },
  ];


  const isDashboardRoute = location.pathname.startsWith('/dashboard');
  const isActive = (slug) => location.pathname === slug;

  return (
    <header className=" bg-white shadow-md z-50 border-b border-gray-300">
      <nav className="container mx-auto px-4 flex items-center justify-between">
        
        {/* Logo - only visible outside of dashboard */}
        {!isDashboardRoute && (
          <div className="mr-4">
            <Link to="/">
              <FcBullish fontSize={32} />
            </Link>
          </div>
        )}

        {/* Centered Navigation Links on Dashboard Page */}
        <div className={`${isDashboardRoute ? 'flex-1 flex justify-center' : 'ml-auto'} pt-3 pb-1 space-x-4`}>
          <ul className="flex space-x-4">
            {navItems
              .filter((item) => item.active)
              .map((item) => (
                <li key={item.name}>
                  <button
                    onClick={() => navigate(item.slug)}
                    className={`px-3 py-2 transition duration-200 rounded-md ${
                      isActive(item.slug)
                        ? 'bg-indigo-500 text-white'
                        : 'text-black hover:bg-gray-100 hover:text-indigo-500'
                    }`}
                    aria-label={`Navigate to ${item.name}`}
                  >
                    {item.name}
                  </button>
                </li>
              ))}
          </ul>
        </div>

        {/* User Avatar - remains on the right end */}
        {authStatus && (
          <div className="relative ml-4">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
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
                <DropdownMenu />
              </div>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}

export default Header;
