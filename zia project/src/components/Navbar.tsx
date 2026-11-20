import React from 'react';

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ cartCount, onOpenCart }) => {
  return (
    <header className="sticky top-0 z-40 border-b border-zinc-800/80 bg-zinc-950/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">
        {/* Brand Name */}
        <a href="#" className="flex items-center gap-2 text-xl font-black tracking-widest text-white">
          <span className="inline-block h-2.5 w-2.5 rounded-sm bg-amber-400" />
          ACCESS<span className="font-light text-zinc-400">ORABLE</span>
        </a>

        {/* Navigation Links */}
        <nav className="hidden items-center gap-8 text-sm font-medium text-zinc-400 md:flex">
          <a href="#collection" className="transition hover:text-white">
            All Accessories
          </a>
          <a href="#collection" className="transition hover:text-white">
            Watches
          </a>
          <a href="#collection" className="transition hover:text-white">
            Bags & Carry
          </a>
          <a href="#footer" className="transition hover:text-white">
            About
          </a>
        </nav>

        {/* Cart Button */}
        <button
          onClick={onOpenCart}
          className="flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:border-zinc-700 hover:bg-zinc-800"
        >
          <span>Cart</span>
          <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-amber-400 px-1.5 text-xs font-bold text-zinc-950">
            {cartCount}
          </span>
        </button>
      </div>
    </header>
  );
};