import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import "./MovieThumb.css";

//const MovieThumb = props => {
//using destructuring syntax for props
const MovieThumb = ({ clickable, movieId, movieName, image }) => {
  return (
    <div className="rmdb-moviethumb">
      {/* check the clickable prop if it's true then enable link else not */}
      {clickable ? (
        <Link
          to={{
            //prepare props to send to Movie component
            pathname: `/${movieId}`,
            moviename: `${movieName}`
          }}
        >
          <img src={image} alt="moviethumbs" />
        </Link>
      ) : (
        <img src={image} alt="moviethumbs" />
      )}
    </div>
  );
};

//PropType check to ensure correct Props are being sent and received
MovieThumb.propTypes = {
  movieId: PropTypes.number,
  movieName: PropTypes.string,
  image: PropTypes.string
};

export default MovieThumb;
