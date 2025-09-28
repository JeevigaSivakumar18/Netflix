import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { TMDB_BASE_URL, API_KEY, hasApiKey } from "../utils/constants";
import { MOCK_GENRES } from "../utils/mock-data";

// Fetch genres
export const getGenres = createAsyncThunk("netflix/genres", async () => {
	if (!hasApiKey()) return MOCK_GENRES;
	const {
		data: { genres },
	} = await axios.get(`${TMDB_BASE_URL}/genre/movie/list?api_key=${API_KEY}&language=en-US`);
	return genres;
});

// Fetch movies by genre (returns results array)
export const fetchMoviesByGenre = createAsyncThunk(
	"netflix/moviesByGenre",
	async ({ genreId, page = 1 }) => {
		if (!hasApiKey()) return [];
		const {
			data: { results },
		} = await axios.get(`${TMDB_BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${genreId}&page=${page}`);
		return results;
	}
);

const genreSlice = createSlice({
	name: "genre",
	initialState: {
		genres: [],
		moviesByGenre: [],
		loading: false,
		error: null,
	},
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(getGenres.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(getGenres.fulfilled, (state, action) => {
				state.loading = false;
				state.genres = action.payload;
			})
			.addCase(getGenres.rejected, (state, action) => {
				state.loading = false;
				state.error = action.error?.message || "Failed to load genres";
				state.genres = MOCK_GENRES;
			})
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