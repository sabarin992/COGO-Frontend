import React from "react";

const Footer = () => {
  return (
    <footer className="w-full border-t border-gray-200 bg-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Logo */}
        <div className="text-2xl font-black tracking-tight text-black">
          COGO
        </div>

        {/* Copyright */}
        <p className="text-sm text-gray-500 text-center">
          © 2026 COGO. All rights reserved.
        </p>

        {/* Links */}
        <div className="flex items-center gap-5 text-sm">
          <a
            href="#"
            className="text-gray-500 hover:text-black transition"
          >
            Privacy
          </a>

          <a
            href="#"
            className="text-gray-500 hover:text-black transition"
          >
            Terms
          </a>

          <a
            href="#"
            className="text-gray-500 hover:text-black transition"
          >
            Cookies
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;