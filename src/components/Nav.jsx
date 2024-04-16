import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

function Nav({ loggedIn, onLogout }) {
  return (
    <>
      <nav className='flex items-center justify-between flex-wrap bg-gray-900 p-6'>
        <div className='flex items-center flex-shrink-0 text-white mr-6'>
          <span className='font-semibold text-4xl tracking-tight'>
            <Link
              to='/'
              className='block font-bold mt-4 lg:inline-block lg:mt-0 text-white hover:text-white mr-4'
            >
              Timer App
            </Link>
          </span>
        </div>
        <div className='w-full block flex-grow lg:flex lg:items-center lg:w-auto'>
          <div className='text-xl lg:flex-grow'>
            {!loggedIn && (
              <>
                <Link
                  to='/register'
                  className='block mt-4 lg:inline-block lg:mt-0 text-teal-lighter hover:text-white mr-4'
                >
                  Register
                </Link>
                <Link
                  to='/login'
                  className='block mt-4 lg:inline-block lg:mt-0 text-teal-lighter hover:text-white mr-4'
                >
                  Login
                </Link>
              </>
            )}
          </div>
          <div>
            {loggedIn && (
              <button
                onClick={onLogout}
                className='inline-block text-xl font-bold px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-gray-900 hover:bg-white mt-4 lg:mt-0'
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
