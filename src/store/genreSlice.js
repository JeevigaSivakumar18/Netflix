import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// ✅ Fetch genres
export const getGenres = createAsyncThunk("netflix/genres", async () => {
  const {
    data: { genres },
  } = await axios.get(
    `https://api.themoviedb.org/3/genre/movie/list?api_key=YOUR_API_KEY&language=en-US`
  );
  return genres;
});

// ✅ Fetch movies by genre
export const fetchMoviesByGenre = createAsyncThunk(
  "netflix/moviesByGenre",
  async ({ genreId, page }) => {
    const {
      data: { results },
    } = await axios.get(
      `https://api.themoviedb.org/3/discover/movie?api_key=YOUR_API_KEY&with_genres=${genreId}&page=${page}`
    );
    return results;
  }
);

const genreSlice = createSlice({
  name: "genre",
  initialState: {
    genres: [],
    moviesByGenre: [],
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Genres
      .addCase(getGenres.pending, (state) => {
        state.loading = true;
      })
      .addCase(getGenres.fulfilled, (state, action) => {
        state.loading = false;
        state.genres = action.payload;
      })
      .addCase(getGenres.rejected, (state) => {
        state.loading = false;
        state.genres = [];
      })

      // Movies by Genre
      .addCase(fetchMoviesByGenre.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMoviesByGenre.fulfilled, (state, action) => {
        state.loading = false;
        state.moviesByGenre = action.payload;
      })
      .addCase(fetchMoviesByGenre.rejected, (state) => {
        state.loading = false;
        state.moviesByGenre = [];
      });
  },
});

export default genreSlice.reducer;
