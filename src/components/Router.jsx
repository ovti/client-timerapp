import { RouterProvider, createBrowserRouter } from "react-router-dom";
import App from "./App";
import ErrorPage from "./ErrorPage";
import Register from "./Register";
import Login from "./Login";
import Sessions from "./Sessions";

const Router = () => {
  const router = createBrowserRouter([
    {
      // path: '/~21_zalubski/timer-app',
      path: "/",
      element: <App />,
      errorElement: <ErrorPage />,
      children: [
        {
          path: "/register",
          element: <Register />,
        },
        {
          path: "/login",
          element: <Login />,
        },
        {
          path: "/sessions",
          element: <Sessions />,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
};

export default Router;
