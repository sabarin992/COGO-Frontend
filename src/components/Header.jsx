import React, { useState } from "react";

const Header = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
          {/* Left Logo */}
          <div className="text-3xl font-black tracking-tight text-black">
            COGO
          </div>

          {/* Center Menu */}
          <nav className="hidden md:flex items-center gap-10 absolute left-1/2 -translate-x-1/2">
            <a
              href="#"
              className="text-black font-semibold border-b-2 border-black pb-1"
            >
              Find a Ride
            </a>

            <a
              href="#"
              className="text-gray-600 hover:text-black transition duration-200 font-semibold"
            >
              Post a Ride
            </a>

            <a
              href="#"
              className="text-gray-600 hover:text-black transition duration-200 font-semibold"
            >
              My Rides
            </a>
          </nav>

          {/* Right Hamburger */}
          <button
            onClick={() => setOpen(!open)}
            className="flex flex-col gap-1.5 md:hidden"
          >
            <span className="w-6 h-0.5 bg-black"></span>
            <span className="w-6 h-0.5 bg-black"></span>
            <span className="w-6 h-0.5 bg-black"></span>
          </button>

          {/* Desktop Hamburger */}
          <button className="hidden md:flex flex-col gap-1.5 cursor-pointer">
            <span className="w-6 h-0.5 bg-black"></span>
            <span className="w-6 h-0.5 bg-black"></span>
            <span className="w-6 h-0.5 bg-black"></span>
          </button>
        </div>

        {/* Mobile Menu */}
        {open && (
          <div className="md:hidden border-t border-gray-200 bg-white px-4 py-5">
            <nav className="flex flex-col gap-5">
              <a
                href="#"
                className="text-black font-semibold border-b border-black pb-2"
              >
                Find a Ride
              </a>

              <a href="#" className="text-gray-600 hover:text-black transition">
                Post a Ride
              </a>

              <a href="#" className="text-gray-600 hover:text-black transition">
                My Rides
              </a>
            </nav>
          </div>
        )}
      </header>

      {/* Spacer */}
      <div className="h-20"></div>
    </>
  );
};

export default Header;
