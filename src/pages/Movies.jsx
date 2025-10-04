import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getGenres, fetchMoviesFromFirestore } from "../store";
import { onAuthStateChanged } from "firebase/auth";
import { firebaseAuth } from "../utils/firebase-config";
import Navbar from "../components/Navbar";
import Slider from "../components/Slider";
import styled from "styled-components";
import NotAvailable from "../components/NotAvailable";
import SelectGenre from "../components/SelectGenre";
import { FaSearch } from "react-icons/fa";

export default function Movies() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState("Top Picks");
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [inputHover, setInputHover] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const movies = useSelector((state) => state.netflix.movies);
  const genres = useSelector((state) => state.genre.genres);

  useEffect(() => {
    dispatch(getGenres());
    dispatch(fetchMoviesFromFirestore());
  }, [dispatch]);

  useEffect(() => {
    onAuthStateChanged(firebaseAuth, (currentUser) => {
      if (!currentUser) navigate("/login");
    });
  }, [navigate]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY !== 0);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Search functionality
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const filtered = movies.filter(movie =>
      movie.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setSearchResults(filtered);
    setIsSearching(false);
  }, [searchQuery, movies]);

  // Filter movies based on selected genre
  const filteredMovies =
    selectedGenre === "Top Picks"
      ? movies.slice(0, 10)
      : movies.filter((m) => (m.genres || []).includes(selectedGenre));

  // Determine which movies to display
  const displayMovies = searchQuery.trim() ? searchResults : filteredMovies;

  return (
    <Container>
      <Navbar isScrolled={isScrolled} />
      <Header>
        <div className="header-left">
          <h1>
            {searchQuery.trim() 
              ? `Search Results for "${searchQuery}"` 
              : selectedGenre
            }
          </h1>
          {!searchQuery.trim() && (
            <SelectGenre
              genres={["Top Picks", ...genres]}
              onChange={(genre) => setSelectedGenre(genre)}
              value={selectedGenre}
            />
          )}
        </div>
        
        <SearchContainer>
          <div className={`search ${showSearch ? "show" : ""}`}>
            <div className="search-wrapper">
              <button
                className="search-btn"
                onFocus={() => setShowSearch(true)}
                onBlur={() => {
                  if (!inputHover) setShowSearch(false);
                }}
              >
                <FaSearch />
              </button>
              <input
                type="text"
                placeholder="Search movies by title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onMouseEnter={() => setInputHover(true)}
                onMouseLeave={() => setInputHover(false)}
                onBlur={() => {
                  setShowSearch(false);
                  setInputHover(false);
                }}
              />
            </div>
          </div>
        </SearchContainer>
      </Header>

      <Content>
        {isSearching ? (
          <LoadingMessage>Searching movies...</LoadingMessage>
        ) : displayMovies && displayMovies.length > 0 ? (
          <Slider movies={displayMovies} />
        ) : searchQuery.trim() ? (
          <NotAvailable message={`No movies found for "${searchQuery}"`} />
        ) : (
          <NotAvailable message="No movies available for this genre." />
        )}
      </Content>
    </Container>
  );
}

// Styled Components
const Container = styled.div`
  background-color: #141414;
  min-height: 100vh;
  color: white;
  padding-top: 68px; /* Account for fixed navbar */
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 5rem 2rem 2rem 2rem;
  flex-wrap: wrap;
  gap: 20px;

  .header-left {
    display: flex;
    align-items: center;
    gap: 30px;
    flex-wrap: wrap;
  }

  h1 {
    font-size: 2rem;
    margin: 0;
    color: white;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    margin: 3rem 1rem 1rem 1rem;

    .header-left {
      gap: 15px;
    }

    h1 {
      font-size: 1.5rem;
    }
  }
`;

const SearchContainer = styled.div`
  display: flex;
  align-items: center;

  .search {
    position: relative;
    
    .search-wrapper {
      display: flex;
      align-items: center;
      background: transparent;
      transition: all 0.3s ease;
      border: 1px solid transparent;
      border-radius: 4px;
    }

    &.show .search-wrapper {
      background: rgba(0, 0, 0, 0.9);
      border: 1px solid rgba(255, 255, 255, 0.3);
    }

    .search-btn {
      background: transparent;
      border: none;
      color: white;
      cursor: pointer;
      padding: 10px 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      transition: color 0.3s ease;

      &:hover {
        color: #b3b3b3;
      }
    }

    input {
      background: transparent;
      border: none;
      outline: none;
      color: white;
      padding: 8px 12px 8px 0;
      width: 0;
      opacity: 0;
      transition: all 0.3s ease;
      font-size: 14px;
      min-height: 40px;

      &::placeholder {
        color: rgba(255, 255, 255, 0.7);
      }
    }

    &.show input {
      width: 280px;
      opacity: 1;

      @media (max-width: 768px) {
        width: 200px;
      }

      @media (max-width: 480px) {
        width: 150px;
      }
    }
  }
`;

const Content = styled.div`
  margin: 2rem 2rem 4rem 2rem;

  @media (max-width: 768px) {
    margin: 1rem 1rem 2rem 1rem;
  }
`;

const LoadingMessage = styled.div`
  text-align: center;
  font-size: 1.2rem;
  color: #b3b3b3;
  padding: 40px 0;
`;