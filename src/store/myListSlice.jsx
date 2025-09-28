import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Initialize from localStorage if present
function loadInitialMyList() {
  try {
    const raw = localStorage.getItem("myList");
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (err) {
    console.error("Failed to parse myList from localStorage:", err.message);
    return [];
  }
}

const myListSlice = createSlice({
  name: "myList",
  initialState: loadInitialMyList(),
  reducers: {
    addToList: (state, action) => {
      if (!state.find((movie) => movie.id === action.payload.id)) {
        state.push(action.payload);
      }
    },
    removeFromList: (state, action) => {
      return state.filter((movie) => movie.id !== action.payload);
    },
    setList: (state, action) => {
      return action.payload || [];
    },
  },
});

export const { addToList, removeFromList, setList } = myListSlice.actions;
export default myListSlice.reducer;

// Async thunks to add/remove and sync to Firestore when user is signed in
export const addToListAsync = createAsyncThunk(
  "myList/addAndSync",
  async (movie, thunkAPI) => {
    // first update local state
    thunkAPI.dispatch(addToList(movie));
    return movie;
  }
);

export const removeFromListAsync = createAsyncThunk(
  "myList/removeAndSync",
  async (movieId, thunkAPI) => {
    thunkAPI.dispatch(removeFromList(movieId));
    return movieId;
  }
);
