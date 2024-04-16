import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import App from './App';
import ErrorPage from './ErrorPage';
import Register from './Register';
import Login from './Login';
// import Categories from './Categories';
import Sessions from './Sessions';

const Router = () => {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <App />,
      errorElement: <ErrorPage />,
      children: [
        {
          path: '/register',
          element: <Register />,
        },
        {
          path: '/login',
          element: <Login />,
        },
        // {
        //   path: '/categories',
        //   element: <Categories />,
        // },
        {
          path: '/sessions',
          element: <Sessions />,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
};

export default Router;
