import PropTypes from "prop-types";
import Timer from "./Timer";

const Home = ({
  id,
  sessions,
  categories,
  tasks,
  settings,
  fetchSessions,
  fetchCategories,
  fetchTasks,
}) => {
  return (
    <Timer
      id={id}
      sessions={sessions}
      categories={categories}
      tasks={tasks}
      settings={settings}
      fetchSessions={fetchSessions}
      fetchCategories={fetchCategories}
      fetchTasks={fetchTasks}
    />
  );
};

Home.propTypes = {
  id: PropTypes.number.isRequired,
  sessions: PropTypes.arrayOf(PropTypes.object).isRequired,
  categories: PropTypes.arrayOf(PropTypes.object).isRequired,
  tasks: PropTypes.arrayOf(PropTypes.object).isRequired,
  settings: PropTypes.object.isRequired,
  fetchSessions: PropTypes.func.isRequired,
  fetchCategories: PropTypes.func.isRequired,
  fetchTasks: PropTypes.func.isRequired,
};

export default Home;
