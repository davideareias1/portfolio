import React from "react";

const Footer = () => {
  return (
    <footer className="bg-white/5 py-6">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center sm:justify-between">
          <p className="text-center text-sm text-gray-400 sm:text-left">
            Designed in Figma, Built with Next.js & Tailwind CSS. Deployed on
            Vercel.
          </p>
          <p className="mt-4 text-center text-sm text-gray-400 sm:mt-0 sm:text-right">
            © 2025 Davide Areias
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
