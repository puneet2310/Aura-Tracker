import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const DropdownMenu = () => {

  const [isOpen, setIsOpen] = useState(false);
  const dropdownItems = [
    { name: 'Profile', slug: '/Profile' },
    { name: 'Settings', slug: '/Setting' },
    { name: 'Contact Us', slug: '/Contact' },
  ];

  return (
    <div className="bg-white shadow-lg mt-2 rounded-lg border border-gray-200 w-48">
      <ul className="text-gray-700">
        {dropdownItems.map((item) => (
          <li key={item.name}>
            <Link
              to={item.slug}
              className="block px-4 py-2 hover:bg-indigo-600 hover:text-white transition duration-200 rounded"
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
