// nav.jsx
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

function Nav({ loggedIn, onLogout }) {
  return (
    <>
      <nav className="mx-auto flex w-11/12 flex-wrap  items-center justify-center border-b-2 border-fire-brick p-3 md:mx-auto md:w-3/4 md:border-b-4 md:p-4 lg:mx-auto lg:w-1/2 lg:justify-between lg:p-6">
        <div className="flex flex-shrink-0 ">
          <span className="text-5xl font-semibold tracking-tight">
            <Link to="/" className=" block font-bold   lg:mt-0 lg:inline-block">
              Timer App
            </Link>
          </span>
        </div>
        <div className="block w-full flex-grow md:flex md:w-auto md:items-center md:justify-center md:align-middle">
          <div className="text-xl md:flex-grow">
            {!loggedIn && (
              <div className="flex justify-center text-2xl md:justify-end">
                <Link
                  to="/login"
                  className="mr-4 mt-4 block   hover:text-rose-900 lg:mt-0 lg:inline-block"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="mr-4 mt-4 block   hover:text-rose-900 lg:mt-0 lg:inline-block"
                >
                  Register
                </Link>
                <Link
                  to="/info"
                  className="mr-4 mt-4 block   hover:text-rose-900 lg:mt-0 lg:inline-block"
                >
                  Info
                </Link>
              </div>
            )}

            {loggedIn && (
              <div className="flex justify-center text-2xl sm:hidden md:justify-end">
                <Link
                  to="/info"
                  className="mt-2 block hover:text-rose-900 lg:mr-4 lg:mt-3 lg:inline-block"
                >
                  Info
                </Link>
              </div>
            )}

            {loggedIn && (
              <div className="flex justify-center text-2xl md:justify-end">
                <Link
                  to="/info"
                  className=" mt-2 hidden hover:text-rose-900 sm:block lg:mr-4 lg:mt-3 lg:inline-block"
                >
                  Info
                </Link>
                <Link
                  to="/settings"
                  className="mt-2 block hover:text-rose-900 lg:mr-4 lg:mt-3 lg:inline-block"
                >
                  Settings
                </Link>
              </div>
            )}
          </div>
          <div className="flex justify-center">
            {loggedIn && (
              <button
                onClick={onLogout}
                className=" mt-4 inline-block rounded border-2 border-rose-700  px-4 py-2 text-xl font-bold leading-none  hover:border-rose-900  hover:text-rose-900"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}

Nav.propTypes = {
  loggedIn: PropTypes.bool.isRequired,
  onLogout: PropTypes.func.isRequired,
};

export default Nav;
