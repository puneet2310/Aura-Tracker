import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../Button';

function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 font-sans">
      <div className="container px-4 py-8 mx-auto">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Main section for subscription */}
          <div className="lg:col-span-2">
            <h1 className="text-xl font-bold tracking-tight text-white xl:text-2xl">
              Subscribe to Aura Tracker for updates
            </h1>
            <div className="flex flex-col mt-4 space-y-2 md:space-y-0 md:flex-row">
              <input
                id="email"
                type="text"
                className="w-full px-4 py-2 text-gray-900 bg-gray-300 border border-gray-500 rounded-lg focus:outline-none focus:border-blue-500"
                placeholder="Email Address"
              />
              <Button className="w-full md:w-auto mt-2 md:mt-0 px-6 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-500 transition duration-300">
                Subscribe
              </Button>
            </div>
          </div>

          {/* Links section moved to the right */}
          <div className="lg:flex lg:justify-end lg:space-x-16">
            <div>
              <p className="font-bold text-white">Quick Links</p>
              <div className="flex flex-col mt-4 space-y-2">
                <Link
                  to="/"
                  className="text-gray-400 transition-colors duration-300 hover:text-blue-400"
                >
                  Home
                </Link>
                {/* Update the Link path for Dashboard to match your route structure */}
                <Link to="/dashboard" className="text-gray-400 transition-colors duration-300 hover:text-blue-400">
                  Dashboard
                </Link>
                <Link to="/set-acad-goals" className="text-gray-400 transition-colors duration-300 hover:text-blue-400">
                  Set Academic Goals
                </Link>
              </div>
            </div>

            <div>
              <p className="font-bold text-white">Favourites</p>
              <div className="flex flex-col mt-4 space-y-2">
                {['Gallery', 'Leaderboard', 'Your Achievements'].map((link, index) => (
                  <p
                    key={index}
                    className="text-gray-400 transition-colors duration-300 hover:text-blue-400 cursor-pointer"
                  >
                    {link}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>

        <hr className="my-6 border-gray-700" />

        <div className="flex justify-between items-center">
          <div className="flex gap-3">
            <img src="https://www.svgrepo.com/show/303114/facebook-3-logo.svg" width="24" alt="Facebook" />
            <img src="https://www.svgrepo.com/show/303115/twitter-3-logo.svg" width="24" alt="Twitter" />
            <img src="https://www.svgrepo.com/show/303145/instagram-2-1-logo.svg" width="24" alt="Instagram" />
            <img src="https://www.svgrepo.com/show/94698/github.svg" width="24" alt="GitHub" />
            <img src="https://www.svgrepo.com/show/28145/linkedin.svg" width="24" alt="LinkedIn" />
            <img src="https://www.svgrepo.com/show/22048/dribbble.svg" width="24" alt="Dribbble" />
          </div>
        </div>
        <p className="mt-6 text-sm text-gray-500 text-center">
          © 2023 Aura Tracker Inc. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
