import { useState } from "react";
import { Link } from "react-router-dom";
import { FaCode } from "react-icons/fa";
import { HiBars3, HiXMark } from "react-icons/hi2";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 border-b border-base-300 bg-base-100">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2" onClick={closeMenu}>
          <FaCode className="text-2xl text-primary" />
          <span className="text-xl font-bold tracking-tight">DevMatch</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Landing navigation">
          <a href="#features" className="transition hover:text-primary">Features</a>
          <a href="#how-it-works" className="transition hover:text-primary">How It Works</a>
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link to="/login" className="btn btn-ghost btn-sm">Login</Link>
          <Link to="/signup" className="btn btn-primary btn-sm">Get Started</Link>
        </div>

        <button
          type="button"
          className="btn btn-ghost btn-circle md:hidden"
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <HiXMark className="text-2xl" /> : <HiBars3 className="text-2xl" />}
        </button>
      </div>

      {menuOpen && (
        <nav className="border-t border-base-300 bg-base-100 p-4 md:hidden" aria-label="Mobile landing navigation">
          <div className="mx-auto flex max-w-7xl flex-col gap-2">
            <a href="#features" className="btn btn-ghost justify-start" onClick={closeMenu}>Features</a>
            <a href="#how-it-works" className="btn btn-ghost justify-start" onClick={closeMenu}>How It Works</a>
            <Link to="/login" className="btn btn-ghost justify-start" onClick={closeMenu}>Login</Link>
            <Link to="/signup" className="btn btn-primary" onClick={closeMenu}>Get Started</Link>
          </div>
        </nav>
      )}
    </header>
  );
};

export default Navbar;
