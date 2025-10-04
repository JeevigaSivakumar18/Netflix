import React from "react";
import CardSlider from "./CardSlider";
import Loading from "./Loading";
import ErrorMessage from "./ErrorMessage";
import PropTypes from "prop-types";

function Slider({ movies = [], loading = false, error = null }) {
  if (!Array.isArray(movies)) movies = [];

  // Deduplicate movies by tmdbId
  const uniqueMovies = Array.from(new Map(movies.map(m => [m.tmdbId, m])).values());

  // Define categories exactly as in your seed data
  const categories = {
    Trending: [],
    "New Releases": [],
    Blockbusters: [],
    Action: [],
    Epics: [],
  };

  // Assign each movie to its category
  uniqueMovies.forEach(movie => {
    const cat = movie.category;
    if (categories[cat]) {
      categories[cat].push(movie);
    }
  });

  return (
    <>
      {loading && <Loading />}
      {error && <ErrorMessage message={error} />}

      {Object.entries(categories).map(([title, arr]) =>
        arr.length > 0 ? <CardSlider key={title} title={title} movies={arr} /> : null
      )}
    </>
  );
}

Slider.propTypes = {
  movies: PropTypes.array,
  loading: PropTypes.bool,
  error: PropTypes.any,
};

export default Slider;
