import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = process.env.REACT_APP_TMDB_API_KEY;

const initialState = {
  movies: [],
  likedMovies: [],
  moviesByCategory: {},
};

// 🔹 Helper functions
const createArrayFromRawData = (array, moviesArray, genres) => {
  array.forEach((movie) => {
    const movieGenres = [];
    movie.genre_ids.forEach((genre) => {
      const name = genres.find(({ id }) => id === genre);
      if (name) movieGenres.push(name.name);
    });
    if (movie.backdrop_path || movie.poster_path) {
      moviesArray.push({
        id: movie.id,
        name: movie?.original_name ? movie.original_name : movie.original_title,
        backdrop: movie.backdrop_path,
        poster: movie.poster_path,
        genres: movieGenres.slice(0, 3),
      });
    }
  });
};

const getRawData = async (api, genres, paging) => {
  const moviesArray = [];
  for (let i = 1; moviesArray.length < 60 && i < 10; i++) {
    const {
      data: { results },
    } = await axios.get(`${api}${paging ? `&page=${i}` : ""}`);
    createArrayFromRawData(results, moviesArray, genres);
  }
  return moviesArray;
};

// 🔹 Thunks
export const fetchMovies = createAsyncThunk(
  "netflix/trending",
  async ({ type }, thunkApi) => {
    const {
      genre: { genres },
    } = thunkApi.getState();
    return getRawData(
      `${TMDB_BASE_URL}/trending/${type}/week?api_key=${API_KEY}`,
      genres,
      true
    );
  }
);

export const fetchMoviesByCategory = createAsyncThunk(
  "netflix/moviesByCategory",
  async ({ category, url }, thunkApi) => {
    const {
      genre: { genres },
    } = thunkApi.getState();

    try {
      const movies = await getRawData(url, genres, true);
      return { category, movies };
    } catch (error) {
      console.error(`[Thunk] Error fetching ${category}:`, error.message);
      return { category, movies: [] };
    }
  }
);

// 🔹 Slice
const netflixSlice = createSlice({
  name: "netflix",
  initialState,
  reducers: {
    addToLikedMovies: (state, action) => {
      if (!state.likedMovies.some((movie) => movie.id === action.payload.id)) {
        state.likedMovies.push(action.payload);
      }
    },
    removeFromLikedMovies: (state, action) => {
      state.likedMovies = state.likedMovies.filter(
        (movie) => movie.id !== action.payload
      );
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchMovies.fulfilled, (state, action) => {
      state.movies = action.payload;
    });
    builder.addCase(fetchMoviesByCategory.fulfilled, (state, action) => {
      const { category, movies } = action.payload;
      state.moviesByCategory[category] = movies;
    });
  },
});

export const { addToLikedMovies, removeFromLikedMovies } =
  netflixSlice.actions;

export default netflixSlice.reducer;
