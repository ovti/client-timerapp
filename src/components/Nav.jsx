import { Link } from "react-router-dom";
import PropTypes from "prop-types";

function Nav({ loggedIn, onLogout }) {
  return (
    <>
      <nav className="flex w-full flex-wrap items-center justify-center bg-gray-900 p-3 md:mx-auto md:w-3/4 md:p-4 lg:mx-auto lg:w-1/2 lg:justify-between lg:p-6">
        <div className="flex flex-shrink-0 text-white">
          <span className="text-5xl font-semibold tracking-tight">
            <Link
              to="/"
              className=" block font-bold text-white hover:text-white lg:mt-0 lg:inline-block"
            >
              Timer App
            </Link>
          </span>
        </div>
        <div className="block w-full flex-grow md:flex md:w-auto md:items-center">
          <div className="text-xl md:flex-grow">
            {!loggedIn && (
              <div className="flex justify-center text-2xl md:justify-end">
                <Link
                  to="/login"
                  className="mr-4 mt-4 block text-white hover:text-white lg:mt-0 lg:inline-block"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="mr-4 mt-4 block text-white hover:text-white lg:mt-0 lg:inline-block"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
          <div className="flex justify-center">
            {loggedIn && (
              <button
                onClick={onLogout}
                className=" mt-4 inline-block rounded border border-white px-4 py-2 text-xl font-bold leading-none text-white hover:border-transparent hover:bg-white hover:text-gray-900"
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
