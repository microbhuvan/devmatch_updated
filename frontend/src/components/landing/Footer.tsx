import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-base-300 bg-base-100">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-6 text-sm text-base-content/60 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>© {new Date().getFullYear()} DevMatch</p>
        <div className="flex gap-4">
          <Link to="/login" className="hover:text-primary">Login</Link>
          <Link to="/signup" className="hover:text-primary">Create an account</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
