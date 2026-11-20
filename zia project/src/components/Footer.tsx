import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer id="footer" className="border-t border-zinc-900 bg-zinc-950 py-12 text-zinc-400">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-6 sm:flex-row lg:px-8">
        <div>
          <p className="text-base font-black tracking-widest text-white">
            ACCESS<span className="font-light text-zinc-400">ORABLE</span>
          </p>
          <p className="mt-1 text-xs text-zinc-500">
            Elevated Everyday Accessories & Lifestyle Essentials.
          </p>
        </div>

        <p className="text-xs text-zinc-500">
          © {new Date().getFullYear()} ACCESSORABLE. All rights reserved.
        </p>
      </div>
    </footer>
  );
};