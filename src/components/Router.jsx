import { RouterProvider, createBrowserRouter } from "react-router-dom";
import App from "./App";
import ErrorPage from "./ErrorPage";
import Register from "./Register";
import Login from "./Login";
import Sessions from "./Sessions";
import CompletedTasks from "./CompletedTasks";

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
        {
          path: "/completed-tasks",
          element: <CompletedTasks />,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
};

export default Router;
