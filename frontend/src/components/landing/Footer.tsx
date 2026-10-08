import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-base-300 bg-base-100">
      <div className="mx-auto max-w-7xl px-4 py-6 text-sm text-base-content/60 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-medium text-base-content">DevMatch</p>

            <p className="mt-1">
              © {new Date().getFullYear()} DevMatch. All rights reserved.
            </p>
          </div>

          <nav className="flex flex-wrap gap-x-4 gap-y-2">
            <Link to="/about" className="transition hover:text-primary">
              About Us
            </Link>

            <Link to="/login" className="transition hover:text-primary">
              Login
            </Link>

            <Link to="/signup" className="transition hover:text-primary">
              Create an account
            </Link>
          </nav>
        </div>

        <div className="mt-4 border-t border-base-300 pt-4 text-xs text-base-content/50">
          <p>
            DevMatch is operated by{" "}
            <span className="font-medium text-base-content/70">
              Bhuvan Mallikarjuna
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
