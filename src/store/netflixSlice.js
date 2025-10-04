import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../utils/firebase-config";

const initialState = {
  movies: [],
  likedMovies: [],
  loading: false,
  error: null,
};

// Fetch all movie documents from the 'movies' collection in Firestore
export const fetchMoviesFromFirestore = createAsyncThunk(
  "netflix/fetchFromFirestore",
  async (_, thunkAPI) => {
    try {
      const col = collection(db, "movies");
      const snapshot = await getDocs(col);
      const movies = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      // debug: size and first few elements
      console.debug("fetchMoviesFromFirestore -> total:", snapshot.size);
      if (movies.length > 0) console.debug("fetchMoviesFromFirestore -> sample:", movies.slice(0, 3));
      return movies;
    } catch (err) {
      console.error("fetchMoviesFromFirestore error:", err?.message || err);
      // propagate error for rejected action (so UI can show it)
      return thunkAPI.rejectWithValue(err?.message || "Failed to fetch movies");
    }
  }
);

const netflixSlice = createSlice({
  name: "netflix",
  initialState,
  reducers: {
    addToLikedMovies: (state, action) => {
      if (!state.likedMovies.some((movie) => movie.id === action.payload.id)) {
        state.likedMovies.push(action.payload);
      }
    },
    setMovies: (state, action) => {
      state.movies = action.payload || [];
    },
    removeFromLikedMovies: (state, action) => {
      state.likedMovies = state.likedMovies.filter(
        (movie) => movie.id !== action.payload
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMoviesFromFirestore.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMoviesFromFirestore.fulfilled, (state, action) => {
        state.loading = false;
        state.movies = action.payload;
      })
      .addCase(fetchMoviesFromFirestore.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error?.message || "Failed to load movies";
        state.movies = [];
      });
  },
});

export const { addToLikedMovies, removeFromLikedMovies, setMovies } =
  netflixSlice.actions;

export default netflixSlice.reducer;
