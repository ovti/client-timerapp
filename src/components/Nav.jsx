import { Link } from "react-router-dom";
import PropTypes from "prop-types";

function Nav({ loggedIn, onLogout }) {
  const PATH_URL = import.meta.env.VITE_BASE_PATH_URL;

  return (
    <>
      <nav className="mx-auto flex w-11/12 flex-wrap items-center justify-center border-b-2 border-fire-brick p-3 md:mx-auto md:w-3/4 md:border-b-2 md:p-4 lg:mx-auto lg:w-1/2 lg:justify-between lg:px-4 lg:py-3">
        <div className="flex flex-shrink-0 ">
          <span className="text-5xl font-semibold tracking-tight">
            <Link
              to={PATH_URL}
              className=" block font-bold   lg:mt-0 lg:inline-block"
            >
              Timer App
            </Link>
          </span>
        </div>
        <div className="block w-full flex-grow md:flex md:w-auto md:items-center md:justify-center md:align-middle">
          <div className="text-xl md:flex-grow">
            {!loggedIn && (
              <div className="mt-5 flex justify-center text-xl md:justify-end">
                <Link
                  to={PATH_URL + "/login"}
                  className="mr-4 mt-3 block hover:text-rose-900 lg:mt-0 lg:inline-block"
                >
                  Login
                </Link>
                <Link
                  to={PATH_URL + "/register"}
                  className="mr-4 mt-3 block hover:text-rose-900 lg:mt-0 lg:inline-block"
                >
                  Register
                </Link>
              </div>
            )}
            {loggedIn && (
              <div className="mt-5 flex justify-center text-xl md:flex-grow md:justify-end">
                <Link
                  to={PATH_URL + "/settings"}
                  className="mx-2 mt-2 block hover:text-rose-900 lg:mr-4 lg:mt-0 lg:inline-block"
                >
                  Settings
                </Link>
                <button
                  onClick={onLogout}
                  className="text-l mx-2 mt-2 inline-block rounded border-2 border-rose-700  px-3 py-1 font-bold leading-none hover:border-rose-900  hover:text-rose-900  lg:mt-0"
                >
                  Logout
                </button>
              </div>
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
