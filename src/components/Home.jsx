import PropTypes from 'prop-types';
import Timer from './Timer';

const Home = ({ id, categories, fetchSessions }) => {
  return (
    <Timer id={id} categories={categories} fetchSessions={fetchSessions} />
  );
};

Home.propTypes = {
  id: PropTypes.number.isRequired,
  categories: PropTypes.arrayOf(PropTypes.object).isRequired,
  fetchSessions: PropTypes.func.isRequired,
};

export default Home;
