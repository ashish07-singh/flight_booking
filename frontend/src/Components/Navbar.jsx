import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import logo from '../assets/cywav_logo.webp';

const navItems = [
  { name: "Flights", icon: "✈️", path: "/" },
  { name: "Hotels", icon: "🏨", path: "/soon" },
  { name: "Holidays", icon: "🌴", path: "/soon" },
  { name: "Trains", icon: "🚆", path: "/soon" },
  { name: "Buses", icon: "🚌", path: "/soon" },
  { name: "Cabs", icon: "🚕", path: "/soon" },
  { name: "Attractions", icon: "🎡", path: "/soon" },
  { name: "Visa", icon: "🛂", path: "/soon" },
  { name: "Cruise", icon: "🛳️", path: "/soon" },
  { name: "Forex", icon: "💵", path: "/soon" },
  { name: "Insurance", icon: "🛡️", path: "/soon" },
];

const TopBar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const headerClasses = `
    fixed top-0 left-0 w-full z-50 transition-all duration-300 ease-in-out
    py-3 px-6 flex items-center justify-between
    ${scrolled ? 'bg-white text-gray-800 shadow-md' : 'bg-transparent text-white'}
  `;

  return (
    <header className={headerClasses}>
      {/* Left Section - Logo */}
      <div className="flex items-center space-x-4">
        <Link to="/">
          <img
            src={logo}
            alt="Cywav-logo"
            className="h-8 md:h-10"
          />
        </Link>
      </div>

      {/* Middle Section - Navigation Items (animated) */}
      <nav
        className={`
          hidden lg:flex items-center space-x-4 xl:space-x-2
          transition-all duration-500 ease-in-out
          ${scrolled ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-3 pointer-events-none'}
        `}
      >
        {navItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={`
              flex flex-col items-center justify-center p-2 rounded-md
              hover:bg-gray-100 hover:text-blue-600
              text-gray-800
              transition duration-300
            `}
          >
            <span className="text-2xl">{item.icon}</span>
            <span className="text-xs mt-1 font-medium">{item.name}</span>
          </Link>
        ))}

        {/* "More" dropdown placeholder */}
        <div
          className={`
            relative group cursor-pointer flex flex-col items-center justify-center p-2 rounded-md
            hover:bg-gray-100 hover:text-blue-600 text-gray-800
            transition duration-300
          `}
        >
         
         
        </div>
      </nav>

      
      <div className="flex items-center space-x-4">
        <div
          className={`
            hidden md:flex items-center p-2 rounded-full cursor-pointer
            ${scrolled ? 'bg-gray-100 text-gray-800' : 'bg-blue-600 text-white'}
            hover:opacity-90 transition duration-300
          `}
        >
          {/* Add user/login later */}
        </div>

        {/* Country Selector */}
        

        {/* Language Selector */}
       

        {/* Currency Selector */}
        <div
          className={`
            flex items-center text-sm cursor-pointer
            ${scrolled ? 'text-gray-800' : 'text-white'}
            transition duration-300
          `}
        >
          {/* <span className="mr-1">Currency</span>
          <span className="font-semibold">INR</span>
          <span className="ml-1">▾</span> */}
        </div>
      </div>
    </header>
  );
};

export default TopBar;