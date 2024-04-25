import { useNavigate, useOutletContext } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const UserSettings = () => {
  const { id, nickname, fetchSessions, fetchCategories, fetchTasks } =
    useOutletContext();
  const navigateTo = useNavigate();

  const deleteAllData = async () => {
    try {
      await axios.delete(`http://localhost:3000/user/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      fetchSessions();
      fetchCategories();
      fetchTasks();
      toast.success("User data deleted");
      navigateTo("/");
    } catch (error) {
      toast.error("Error deleting user data");
      console.error("Error deleting user data:", error);
    }
  };

  return (
    <div className="m-2 rounded border border-fire-brick md:mx-auto md:w-10/12 lg:mx-auto lg:mt-8 lg:w-1/4">
      <div className="rounded-lg p-4">
        <button
          onClick={() => navigateTo("/")}
          className="float-right rounded bg-fire-brick p-2 font-bold  hover:bg-red-600"
          style={{ width: "2.5rem", height: "2.5rem" }}
        >
          x
        </button>
        <h2 className="mb-4 text-xl font-semibold ">{nickname} settings</h2>
        <div className="flex justify-center">
          <button
            onClick={deleteAllData}
            className="mt-4 inline-block rounded border-2 border-rose-700 px-4 py-2 text-xl font-bold leading-none hover:border-rose-900"
          >
            Delete all data
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserSettings;
