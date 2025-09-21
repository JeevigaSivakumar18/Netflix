import { configureStore } from "@reduxjs/toolkit";
import netflixReducer from "./netflixSlice";
import genreReducer from "./genreSlice";


export const store = configureStore({
  reducer: {
    netflix: netflixReducer,
    genre: genreReducer,
  },
});

// ✅ Re-export thunks and actions
export * from "./netflixSlice";
export * from "./genreSlice";
