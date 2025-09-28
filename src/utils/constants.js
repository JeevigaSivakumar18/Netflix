export const TMDB_BASE_URL = "https://api.themoviedb.org/3";

// Prefer environment variable for development. If not present, code will fall back
// to mock data to allow running the app without signing up for an API key.
export const API_KEY = process.env.REACT_APP_TMDB_API_KEY || "";

export function hasApiKey() {
	return typeof API_KEY === "string" && API_KEY.length > 0;
}