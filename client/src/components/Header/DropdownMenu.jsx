// DropdownMenu.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const DropdownMenu = () => {
  const dropdownItems = [
    { name: 'Item 1', slug: '/item1' },
    { name: 'Item 2', slug: '/item2' },
    { name: 'Item 3', slug: '/item3' },
  ];

  return (
    <div className="absolute bg-white shadow-lg mt-2 rounded">
      <ul>
        {dropdownItems.map((item) => (
          <li key={item.name}>
            <Link to={item.slug} className="block px-4 py-2 hover:bg-gray-200">
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DropdownMenu;
