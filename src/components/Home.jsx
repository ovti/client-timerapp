import PropTypes from 'prop-types';
import Timer from './Timer';

const Home = ({ id, categories }) => {
  return <Timer id={id} categories={categories} />;
};

Home.propTypes = {
  id: PropTypes.number.isRequired,
  categories: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default Home;
