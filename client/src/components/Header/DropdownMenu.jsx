// DropdownMenu.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const DropdownMenu = () => {
  const dropdownItems = [
    { name: 'Profile', slug: '/profile' },
    { name: 'Contact', slug: '/contact' },
    { name: 'Setting', slug: '/settings' },
  ];

  return (
    <div className="absloute bg-white shadow-lg rounded-md mt-2 w-48 border border-gray-200">
      <ul>
        {dropdownItems.map((item) => (
          <li key={item.name}>
            <Link
              to={item.slug}
              className="block px-4 py-3 text-gray-700 hover:bg-gray-100 hover:text-blue-600 transition duration-150"
            >
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DropdownMenu;
