import PropTypes from 'prop-types';
import Timer from './Timer';

const Home = ({ id }) => {
  return <Timer id={id} />;
};

Home.propTypes = {
  id: PropTypes.number.isRequired,
};

export default Home;
