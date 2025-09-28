// Minimal mock data for development without TMDB API key
export const MOCK_GENRES = [
  { id: 28, name: "Action" },
  { id: 12, name: "Adventure" },
  { id: 35, name: "Comedy" },
];

export const MOCK_MOVIES = [
  {
    id: 1,
    name: "Mock Movie One",
    backdrop: null,
    poster: "/mock-poster-1.jpg",
    genres: ["Action", "Adventure"],
  },
  {
    id: 2,
    name: "Mock Movie Two",
    backdrop: null,
    poster: "/mock-poster-2.jpg",
    genres: ["Comedy"],
  },
  {
    id: 3,
    name: "Mock Movie Three",
    backdrop: null,
    poster: "/mock-poster-3.jpg",
    genres: ["Action"],
  },
];
