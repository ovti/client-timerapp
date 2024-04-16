import PropTypes from 'prop-types';
import Timer from './Timer';

const Home = ({
  id,
  categories,
  tasks,
  fetchSessions,
  fetchCategories,
  fetchTasks,
}) => {
  return (
    <Timer
      id={id}
      categories={categories}
      fetchCategories={fetchCategories}
      tasks={tasks}
      fetchSessions={fetchSessions}
      fetchTasks={fetchTasks}
    />
  );
};

Home.propTypes = {
  id: PropTypes.number.isRequired,
  categories: PropTypes.arrayOf(PropTypes.object).isRequired,
  tasks: PropTypes.arrayOf(PropTypes.object).isRequired,
  fetchCategories: PropTypes.func.isRequired,
  fetchSessions: PropTypes.func.isRequired,
  fetchTasks: PropTypes.func.isRequired,
};

export default Home;
