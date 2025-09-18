import {
  configureStore,
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";
import axios from "axios";

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
// Load API key from environment variable
const API_KEY = process.env.REACT_APP_TMDB_API_KEY;

const initialState = {
  movies: [],
  genresLoaded: false,
  genres: [],
  likedMovies: [],
  moviesByCategory: {}, // Add this for category-based movies
};

// Async thunk for fetching genres
const getGenres = createAsyncThunk("netflix/genres", async () => {
  const {
    data: { genres },
  } = await axios.get(
    `${TMDB_BASE_URL}/genre/movie/list?api_key=${API_KEY}`
  );
  return genres;
});

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
        name: movie?.original_name
          ? movie.original_name
          : movie.original_title,
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

// Existing async thunk for fetching trending movies
export const fetchMovies = createAsyncThunk(
  "netflix/trending",
  async ({ type }, thunkApi) => {
    const {
      netflix: { genres },
    } = thunkApi.getState();
    return getRawData(
      `${TMDB_BASE_URL}/trending/${type}/week?api_key=${API_KEY}`,
      genres,
      true
    );
  }
);

// NEW: Async thunk for fetching movies by category
export const fetchMoviesByCategory = createAsyncThunk(
  "netflix/moviesByCategory",
  async ({ category, url }, thunkApi) => {
    const {
      netflix: { genres },
    } = thunkApi.getState();
    
    const moviesArray = await getRawData(url, genres, true);
    
    return {
      category,
      movies: moviesArray,
    };
  }
);

const NetflixSlice = createSlice({
  name: "Netflix",
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
    builder.addCase(getGenres.fulfilled, (state, action) => {
      state.genres = action.payload;
      state.genresLoaded = true;
    });
    builder.addCase(fetchMovies.fulfilled, (state, action) => {
      state.movies = action.payload;
    });
    // NEW: Handle fetchMoviesByCategory
    builder.addCase(fetchMoviesByCategory.fulfilled, (state, action) => {
      const { category, movies } = action.payload;
      state.moviesByCategory[category] = movies;
    });
  },
});

// ✅ Export actions
export const { addToLikedMovies, removeFromLikedMovies } =
  NetflixSlice.actions;

// ✅ Export async thunks
export { getGenres };

// ✅ Store
export const store = configureStore({
  reducer: {
    netflix: NetflixSlice.reducer,
  },
});