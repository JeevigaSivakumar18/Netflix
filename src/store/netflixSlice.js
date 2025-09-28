import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../utils/firebase-config";

const initialState = {
  movies: [],
  likedMovies: [],
  loading: false,
  error: null,
};

// 🔹 Thunks (Firestore-backed)
// Fetch all movie documents from the 'movies' collection in Firestore
export const fetchMoviesFromFirestore = createAsyncThunk(
  "netflix/fetchFromFirestore",
  async () => {
    try {
      const col = collection(db, "movies");
      const snapshot = await getDocs(col);
      const movies = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      return movies;
    } catch (err) {
      console.error("fetchMoviesFromFirestore error:", err.message);
      return [];
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
        state.error = action.error?.message || "Failed to load movies";
        state.movies = [];
      });
  },
});

export const { addToLikedMovies, removeFromLikedMovies, setMovies } =
  netflixSlice.actions;

export default netflixSlice.reducer;
