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


function Movies() {
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const movies = useSelector((state) => state.netflix.movies);
  const genres = useSelector((state) => state.genre.genres);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getGenres());
  }, [dispatch]);

  useEffect(() => {
    // Load movies from Firestore
    dispatch(fetchMoviesFromFirestore());
  }, [dispatch, genres]);

  useEffect(() => {
    onAuthStateChanged(firebaseAuth, (currentUser) => {
      if (!currentUser) navigate("/login"); // redirect only if not logged in
    });
  }, [navigate]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY !== 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <Container>
    <div className="navbar">
      <Navbar isScrolled={isScrolled} />
    </div>
    <div className="genre-selection">
      <SelectGenre genres={genres} />
    </div>
    <div className="data">
      {movies && movies.length > 0 ? (
        <Slider movies={movies} />
      ) : (
        <NotAvailable />
      )}
    </div>
  </Container>
  );
}

export default Movies;

const Container = styled.div`
   .navbar {
    position: sticky;
    top: 0;
    z-index: 100;
  }
  .genre-selection {
    margin: 6rem 2rem 2rem 2rem;
    z-index: 50;
  }
  .data {
    margin-top: 2rem;
    .not-available {
      text-align: center;
      color: white;
      margin-top: 4rem;
    }
  }
`;
