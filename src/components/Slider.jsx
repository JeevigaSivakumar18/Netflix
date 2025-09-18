import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMoviesByCategory, getGenres } from "../store";
import { TMDB_BASE_URL, API_KEY } from "../utils/constants";
import CardSlider from "./CardSlider";

const categories = {
  trending: `${TMDB_BASE_URL}/movie/popular?api_key=${API_KEY}`, // Changed from trending/all/week
  newReleases: `${TMDB_BASE_URL}/movie/now_playing?api_key=${API_KEY}`,
  blockbuster: `${TMDB_BASE_URL}/movie/top_rated?api_key=${API_KEY}`, // Changed from popular
  action: `${TMDB_BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=28`,
  epics: `${TMDB_BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=36`,
};

function Slider() {
  const dispatch = useDispatch();
  const { moviesByCategory, genresLoaded } = useSelector(
    (state) => state.netflix
  );

  useEffect(() => {
    console.log("Starting fetch...");
    console.log("API_KEY defined:", !!API_KEY);
    dispatch(getGenres()).then(() => {
      console.log("Genres loaded, fetching categories...");
      Object.entries(categories).forEach(([category, url]) => {
        console.log(`Fetching ${category} from:`, url);
        dispatch(fetchMoviesByCategory({ category, url }))
          .then((result) => {
            console.log(`${category} fetch result:`, result);
          })
          .catch((error) => {
            console.error(`${category} fetch error:`, error);
          });
      });
    });
  }, [dispatch]);

  // Debug log to see what data we have
  console.log("Movies by category:", moviesByCategory);
  console.log("Trending data specifically:", moviesByCategory?.trending);
  console.log("Trending length:", moviesByCategory?.trending?.length);
  console.log("First trending movie:", moviesByCategory?.trending?.[0]);
  console.log("Genres loaded:", genresLoaded);

  return (
    <>
      <CardSlider title="Trending" data={moviesByCategory?.trending || moviesByCategory?.newReleases || []} />
      <CardSlider title="New Releases" data={moviesByCategory?.newReleases || []} />
      <CardSlider title="Blockbuster Movies" data={moviesByCategory?.blockbuster || []} />
      <CardSlider title="Action Movies" data={moviesByCategory?.action || []} />
      <CardSlider title="Epics" data={moviesByCategory?.epics || []} />
    </>
  );
}

export default Slider;