import PropTypes from 'prop-types';

const ErrorComponent = ({ message }) => {
  return (
    <div className="error">
      <p>Error: {message}</p>
    </div>
  );
};

ErrorComponent.propTypes = {
  message: PropTypes.string.isRequired,
};

export default ErrorComponent;
