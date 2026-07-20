import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  FaBars,
  FaBell,
  FaCode,
  FaLock,
  FaRightFromBracket,
  FaMoon,
  FaSun,
  FaUser,
} from "react-icons/fa6";
import { FaCrown } from "react-icons/fa";

import { logout as logoutService } from "../../services/auth.service";
import { logout as logoutAction } from "../../redux/slices/authSlice";
import { toggleTheme } from "../../redux/slices/themeSlice";
import type { RootState } from "../../redux/store";
import { clearProfile } from "../../redux/slices/profileSlice";
import { logoutAll as logoutAllService } from "../../services/auth.service";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [drawerOpen, setDrawerOpen] = useState(false);

  const pendingCount = useSelector(
    (state: RootState) => state.notification.pendingRequestCount,
  );
  const darkMode = useSelector((state: RootState) => state.theme.darkMode);

  const user = useSelector((state: RootState) => state.auth.user);

  const handleLogout = async () => {
    try {
      await logoutService();
    } catch (err) {
      console.error(err);
    } finally {
      dispatch(logoutAction());
      dispatch(clearProfile());
      navigate("/login");
    }
  };

  const handleLogoutAll = async () => {
    try {
      await logoutAllService();
    } catch (err) {
      console.error(err);
    } finally {
      dispatch(logoutAction());
      dispatch(clearProfile());
      navigate("/login");
    }
  };

  const closeDrawer = () => setDrawerOpen(false);

  return (
    <header className="sticky top-0 z-50 border-b border-base-300 bg-base-100">
      <div className="navbar mx-auto max-w-7xl px-4">
        {/* Mobile Menu */}
        <div className="navbar-start">
          <button
            className="btn btn-ghost lg:hidden"
            onClick={() => setDrawerOpen(true)}
            aria-label="Open navigation menu"
          >
            <FaBars className="text-xl" />
          </button>

          <Link to="/feed" className="flex items-center gap-2">
            <FaCode className="text-2xl text-primary" />

            <span className="hidden sm:inline text-xl font-bold">DevMatch</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal gap-2">
            <li>
              <NavLink to="/feed">Feed</NavLink>
            </li>

            <li>
              <NavLink to="/sent-requests">Sent</NavLink>
            </li>

            <li>
              <NavLink to="/requests" className="flex items-center gap-2">
                Requests
                {pendingCount > 0 && (
                  <span className="badge badge-error badge-sm">
                    {pendingCount}
                  </span>
                )}
              </NavLink>
            </li>

            <li>
              <NavLink to="/connections">Connections</NavLink>
            </li>

            <li>
              <NavLink to="/chats">Chats</NavLink>
            </li>
            <li>
              <NavLink to="/search">Search</NavLink>
            </li>
          </ul>
        </div>

        {/* Right Side */}
        <div className="navbar-end gap-2">
          <button
            type="button"
            className="btn btn-ghost btn-circle"
            onClick={() => dispatch(toggleTheme())}
            aria-label={`Switch to ${darkMode ? "light" : "dark"} mode`}
            title={`Switch to ${darkMode ? "light" : "dark"} mode`}
          >
            {darkMode ? <FaSun /> : <FaMoon />}
          </button>
          {/* Mobile Notification */}
          <Link
            to="/requests"
            className="btn btn-ghost btn-circle lg:hidden"
            aria-label="View connection requests"
          >
            <div className="indicator">
              <FaBell className="text-xl" />

              {pendingCount > 0 && (
                <span className="badge badge-error badge-xs indicator-item">
                  {pendingCount}
                </span>
              )}
            </div>
          </Link>

          {/* Account Dropdown */}
          <div className="dropdown dropdown-end">
            <>
              {/* Desktop */}
              <label tabIndex={0} className="btn btn-primary hidden lg:flex">
                Account
              </label>

              {/* Mobile */}
              <label
                tabIndex={0}
                className="btn btn-circle btn-primary lg:hidden"
              >
                <FaUser />
              </label>
            </>

            <ul
              tabIndex={0}
              className="menu dropdown-content z-[100] mt-3 w-60 rounded-box border border-base-300 bg-base-100 p-2 shadow-xl"
            >
              <li>
                <Link to="/profile">
                  <FaUser />
                  Profile
                </Link>
              </li>

              <li>
                <Link to="/change-password">
                  <FaLock />
                  Change Password
                </Link>
              </li>

              {!user?.isPremium && (
                <li>
                  <Link to="/upgrade">
                    <FaCrown />
                    Upgrade
                  </Link>
                </li>
              )}

              <div className="divider my-1" />

              <li>
                <button onClick={handleLogout}>
                  <FaRightFromBracket />
                  Logout
                </button>
              </li>

              <li>
                <button onClick={handleLogoutAll}>
                  <FaRightFromBracket />
                  Logout All Devices
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      {drawerOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={closeDrawer}
        />
      )}

      {/* Mobile Drawer */}
      <aside
        className={`fixed left-0 top-0 z-50 h-full w-72 bg-base-100 shadow-xl transition-transform duration-300 lg:hidden ${
          drawerOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b p-5">
          <div className="flex items-center gap-2">
            <FaCode className="text-2xl text-primary" />
            <span className="text-xl font-bold">DevMatch</span>
          </div>

          <button
            className="btn btn-sm btn-circle"
            onClick={closeDrawer}
            aria-label="Close navigation menu"
          >
            ✕
          </button>
        </div>

        <ul className="menu w-full p-4 text-base-content">
          <li>
            <NavLink to="/feed" onClick={closeDrawer}>
              Feed
            </NavLink>
          </li>

          <li>
            <NavLink to="/sent-requests" onClick={closeDrawer}>
              Sent Requests
            </NavLink>
          </li>

          <li>
            <NavLink to="/requests" onClick={closeDrawer}>
              Requests
              {pendingCount > 0 && (
                <span className="badge badge-error">{pendingCount}</span>
              )}
            </NavLink>
          </li>

          <li>
            <NavLink to="/connections" onClick={closeDrawer}>
              Connections
            </NavLink>
          </li>

          <li>
            <NavLink to="/chats" onClick={closeDrawer}>
              Chats
            </NavLink>
          </li>

          <li>
            <NavLink to="/search" onClick={closeDrawer}>
              Search
            </NavLink>
          </li>

          <div className="divider" />

          <li>
            <NavLink to="/profile" onClick={closeDrawer}>
              Profile
            </NavLink>
          </li>

          <li>
            <NavLink to="/change-password" onClick={closeDrawer}>
              Change Password
            </NavLink>
          </li>

          {!user?.isPremium && (
            <li>
              <Link to="/upgrade">
                <FaCrown />
                Upgrade
              </Link>
            </li>
          )}

          <li>
            <button
              onClick={() => {
                closeDrawer();
                handleLogout();
              }}
            >
              Logout
            </button>
          </li>
        </ul>
      </aside>
    </header>
  );
};

export default Navbar;
