import { Link } from "react-router-dom";

const ErrorPage = () => {
  const PATH_URL = import.meta.env.VITE_BASE_PATH_URL;

  return (
    <div>
      <h1>Oh no, this route doesn&apos;t exist!</h1>
      <Link to={PATH_URL} className="text-blue-500 hover:underline">
        You can go back to the home page by clicking here!
      </Link>
    </div>
  );
};

export default ErrorPage;
